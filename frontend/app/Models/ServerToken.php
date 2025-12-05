<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ServerToken extends Model
{
    /** @use HasFactory<\Database\Factories\ServerTokenFactory> */
    use HasFactory;

    protected $fillable = [
        'server_id',
        'token',
        'name',
        'pairing_code',
        'pairing_expires_at',
        'is_paired',
        'paired_at',
        'is_active',
        'last_used_at',
        'last_used_ip',
        'request_count',
    ];

    protected $hidden = [
        'token',
    ];

    protected function casts(): array
    {
        return [
            'pairing_expires_at' => 'datetime',
            'paired_at' => 'datetime',
            'last_used_at' => 'datetime',
            'revoked_at' => 'datetime',
            'is_paired' => 'boolean',
            'is_active' => 'boolean',
            'request_count' => 'integer',
        ];
    }

    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class);
    }

    public static function generateToken(): string
    {
        return hash('sha256', Str::random(64));
    }

    public static function generatePairingCode(): string
    {
        return strtoupper(Str::random(8));
    }

    public function generateNewPairingCode(): self
    {
        $this->update([
            'pairing_code' => self::generatePairingCode(),
            'pairing_expires_at' => now()->addMinutes(15),
        ]);

        return $this;
    }

    public function markAsPaired(): void
    {
        $this->update([
            'is_paired' => true,
            'paired_at' => now(),
            'pairing_code' => null,
            'pairing_expires_at' => null,
        ]);
    }

    public function recordUsage(string $ip): void
    {
        $this->update([
            'last_used_at' => now(),
            'last_used_ip' => $ip,
            'request_count' => $this->request_count + 1,
        ]);
    }

    public function revoke(): void
    {
        $this->update([
            'is_active' => false,
            'revoked_at' => now(),
        ]);
    }

    public function isPairingCodeValid(): bool
    {
        return $this->pairing_code
            && $this->pairing_expires_at
            && $this->pairing_expires_at->isFuture();
    }
}

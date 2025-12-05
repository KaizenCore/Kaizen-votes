<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vote extends Model
{
    /** @use HasFactory<\Database\Factories\VoteFactory> */
    use HasFactory;

    protected $fillable = [
        'server_id',
        'user_id',
        'minecraft_username',
        'minecraft_uuid',
        'ip_address',
        'user_agent',
        'earned_rewards',
        'streak',
        'claimed',
        'claimed_at',
        'claimed_rewards',
    ];

    protected function casts(): array
    {
        return [
            'earned_rewards' => 'array',
            'claimed' => 'boolean',
            'claimed_at' => 'datetime',
            'claimed_rewards' => 'array',
        ];
    }

    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeUnclaimed($query)
    {
        return $query->where('claimed', false);
    }

    public function scopeForPlayer($query, string $minecraftUsername)
    {
        return $query->where('minecraft_username', $minecraftUsername);
    }

    public function scopeRecent($query, int $hours = 24)
    {
        return $query->where('created_at', '>=', now()->subHours($hours));
    }

    public function markAsClaimed(array $rewards = []): void
    {
        $this->update([
            'claimed' => true,
            'claimed_at' => now(),
            'claimed_rewards' => $rewards,
        ]);
    }
}

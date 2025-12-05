<?php

namespace App\Models;

use App\Enums\ServerStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Server extends Model
{
    /** @use HasFactory<\Database\Factories\ServerFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'slug',
        'description',
        'banner_url',
        'banner_config',
        'ip_address',
        'port',
        'server_type',
        'bedrock_port',
        'is_modded',
        'modpack_name',
        'modpack_url',
        'launcher',
        'minecraft_versions',
        'server_software',
        'country',
        'language',
        'accepts_cracked',
        'is_whitelisted',
        'minimum_age',
        'founded_at',
        'website_url',
        'discord_url',
        'discord_webhook_url',
        'status',
        'rejection_reason',
        'is_featured',
        'featured_until',
        'current_players',
        'max_players',
        'tps',
        'is_online',
        'last_ping_at',
        'total_votes',
        'monthly_votes',
    ];

    protected function casts(): array
    {
        return [
            'status' => ServerStatus::class,
            'port' => 'integer',
            'bedrock_port' => 'integer',
            'is_modded' => 'boolean',
            'minecraft_versions' => 'array',
            'accepts_cracked' => 'boolean',
            'is_whitelisted' => 'boolean',
            'minimum_age' => 'integer',
            'founded_at' => 'date',
            'total_votes' => 'integer',
            'monthly_votes' => 'integer',
            'current_players' => 'integer',
            'max_players' => 'integer',
            'tps' => 'decimal:2',
            'is_online' => 'boolean',
            'is_featured' => 'boolean',
            'approved_at' => 'datetime',
            'featured_until' => 'datetime',
            'last_ping_at' => 'datetime',
            'banner_config' => 'array',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function rewards(): HasMany
    {
        return $this->hasMany(Reward::class);
    }

    public function tokens(): HasMany
    {
        return $this->hasMany(ServerToken::class);
    }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function activeToken(): HasOne
    {
        return $this->hasOne(ServerToken::class)
            ->where('is_active', true)
            ->where('is_paired', true);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', ServerStatus::Approved);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true)
            ->where(function ($q) {
                $q->whereNull('featured_until')
                    ->orWhere('featured_until', '>', now());
            });
    }

    public function scopeOnline($query)
    {
        return $query->where('is_online', true);
    }

    public function getConnectionString(): string
    {
        return $this->port === 25565
            ? $this->ip_address
            : "{$this->ip_address}:{$this->port}";
    }

    public function isApproved(): bool
    {
        return $this->status === ServerStatus::Approved;
    }

    public function canReceiveVotes(): bool
    {
        return $this->isApproved() && $this->tokens()->where('is_paired', true)->exists();
    }
}

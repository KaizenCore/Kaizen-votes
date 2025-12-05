<?php

namespace App\Models;

use App\Enums\RewardType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reward extends Model
{
    /** @use HasFactory<\Database\Factories\RewardFactory> */
    use HasFactory;

    protected $fillable = [
        'server_id',
        'name',
        'description',
        'reward_type',
        'commands',
        'chance',
        'is_active',
        'sort_order',
        'min_votes',
        'daily_limit',
    ];

    protected function casts(): array
    {
        return [
            'reward_type' => RewardType::class,
            'commands' => 'array',
            'chance' => 'integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'min_votes' => 'integer',
            'daily_limit' => 'integer',
        ];
    }

    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get commands with placeholder replacements.
     *
     * @return array<int, string>
     */
    public function getProcessedCommands(string $playerName): array
    {
        return array_map(function ($command) use ($playerName) {
            return str_replace(
                ['{player}', '{username}'],
                $playerName,
                $command
            );
        }, $this->commands);
    }
}

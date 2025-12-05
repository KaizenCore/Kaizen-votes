<?php

namespace App\Enums;

enum RewardType: string
{
    case Command = 'command';
    case Item = 'item';
    case Currency = 'currency';
    case Permission = 'permission';
    case Rank = 'rank';

    public function label(): string
    {
        return match ($this) {
            self::Command => 'Console Command',
            self::Item => 'In-Game Item',
            self::Currency => 'Virtual Currency',
            self::Permission => 'Permission Node',
            self::Rank => 'Rank Upgrade',
        };
    }
}

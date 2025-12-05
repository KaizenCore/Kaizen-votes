<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            ['name' => 'Economy', 'color' => '#22c55e'],
            ['name' => 'PvE', 'color' => '#3b82f6'],
            ['name' => 'Towny', 'color' => '#f59e0b'],
            ['name' => 'Claims', 'color' => '#8b5cf6'],
            ['name' => 'MCMMO', 'color' => '#ec4899'],
            ['name' => 'Jobs', 'color' => '#14b8a6'],
            ['name' => 'Ranks', 'color' => '#f97316'],
            ['name' => 'Crates', 'color' => '#eab308'],
            ['name' => 'Events', 'color' => '#06b6d4'],
            ['name' => 'Custom Enchants', 'color' => '#a855f7'],
            ['name' => 'Dungeons', 'color' => '#ef4444'],
            ['name' => 'Quests', 'color' => '#84cc16'],
            ['name' => 'Pets', 'color' => '#f472b6'],
            ['name' => 'Vehicles', 'color' => '#6366f1'],
            ['name' => 'Land Claims', 'color' => '#10b981'],
            ['name' => 'Discord', 'color' => '#5865f2'],
            ['name' => 'Crossplay', 'color' => '#0ea5e9'],
            ['name' => 'Anti-Cheat', 'color' => '#dc2626'],
            ['name' => '24/7', 'color' => '#16a34a'],
            ['name' => 'Friendly', 'color' => '#facc15'],
        ];

        foreach ($tags as $tag) {
            Tag::create([
                'name' => $tag['name'],
                'slug' => Str::slug($tag['name']),
                'color' => $tag['color'],
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Survival', 'icon' => 'tent', 'description' => 'Classic survival gameplay with gathering, crafting, and building.'],
            ['name' => 'Creative', 'icon' => 'palette', 'description' => 'Unlimited resources for building and creativity.'],
            ['name' => 'PvP', 'icon' => 'swords', 'description' => 'Player vs Player combat focused servers.'],
            ['name' => 'Minigames', 'icon' => 'gamepad-2', 'description' => 'Various mini-games and arcade experiences.'],
            ['name' => 'Skyblock', 'icon' => 'cloud', 'description' => 'Start on a floating island and expand your world.'],
            ['name' => 'Factions', 'icon' => 'flag', 'description' => 'Team-based gameplay with territory control.'],
            ['name' => 'Prison', 'icon' => 'lock', 'description' => 'Mine your way through ranks to freedom.'],
            ['name' => 'RPG', 'icon' => 'scroll', 'description' => 'Role-playing servers with quests and classes.'],
            ['name' => 'Modded', 'icon' => 'puzzle', 'description' => 'Servers running modpacks and custom content.'],
            ['name' => 'Vanilla', 'icon' => 'box', 'description' => 'Pure Minecraft experience without modifications.'],
        ];

        foreach ($categories as $index => $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'icon' => $category['icon'],
                'sort_order' => $index,
                'is_active' => true,
            ]);
        }
    }
}

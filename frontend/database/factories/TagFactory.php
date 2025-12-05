<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tag>
 */
class TagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Economy', 'PvE', 'Towny', 'Claims', 'MCMMO', 'Jobs',
            'Ranks', 'Crates', 'Events', 'Custom Enchants', 'Dungeons',
            'Quests', 'Pets', 'Vehicles', 'Land Claims', 'Discord',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'color' => fake()->hexColor(),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Enums\RewardType;
use App\Models\Server;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reward>
 */
class RewardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'server_id' => Server::factory(),
            'name' => fake()->randomElement(['Vote Key', 'Money Reward', 'XP Boost', 'Lucky Crate']),
            'description' => fake()->sentence(),
            'reward_type' => fake()->randomElement(RewardType::cases()),
            'commands' => [
                'give {player} tripwire_hook 1',
                'eco give {player} 100',
            ],
            'chance' => 100,
            'is_active' => true,
            'sort_order' => fake()->numberBetween(0, 5),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function withChance(int $chance): static
    {
        return $this->state(fn (array $attributes) => [
            'chance' => $chance,
        ]);
    }
}

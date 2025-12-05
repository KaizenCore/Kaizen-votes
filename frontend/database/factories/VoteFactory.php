<?php

namespace Database\Factories;

use App\Models\Server;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vote>
 */
class VoteFactory extends Factory
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
            'user_id' => User::factory(),
            'minecraft_username' => fake()->userName(),
            'minecraft_uuid' => fake()->optional()->uuid(),
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'claimed' => false,
            'claimed_at' => null,
            'claimed_rewards' => null,
        ];
    }

    public function claimed(): static
    {
        return $this->state(fn (array $attributes) => [
            'claimed' => true,
            'claimed_at' => now(),
            'claimed_rewards' => [
                ['name' => 'Vote Key', 'command' => 'give {player} tripwire_hook 1'],
            ],
        ]);
    }

    public function recent(): static
    {
        return $this->state(fn (array $attributes) => [
            'created_at' => fake()->dateTimeBetween('-24 hours', 'now'),
        ]);
    }

    public function old(): static
    {
        return $this->state(fn (array $attributes) => [
            'created_at' => fake()->dateTimeBetween('-30 days', '-25 hours'),
        ]);
    }
}

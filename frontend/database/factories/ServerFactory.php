<?php

namespace Database\Factories;

use App\Enums\ServerStatus;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Server>
 */
class ServerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company().' MC';

        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->randomNumber(4),
            'description' => fake()->paragraphs(3, true),
            'banner_url' => fake()->optional()->imageUrl(1920, 400),
            'ip_address' => fake()->randomElement(['play.', 'mc.', '']).fake()->domainName(),
            'port' => fake()->randomElement([25565, 25565, 25565, fake()->numberBetween(25566, 25600)]),
            'website_url' => fake()->optional()->url(),
            'discord_url' => fake()->optional()->url(),
            'discord_webhook_url' => null,
            'status' => ServerStatus::Approved,
            'total_votes' => fake()->numberBetween(0, 10000),
            'monthly_votes' => fake()->numberBetween(0, 1000),
            'current_players' => fake()->numberBetween(0, 100),
            'max_players' => fake()->randomElement([50, 100, 200, 500]),
            'tps' => fake()->randomFloat(2, 15, 20),
            'is_online' => fake()->boolean(80),
            'is_featured' => fake()->boolean(10),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ServerStatus::Pending,
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ServerStatus::Approved,
            'approved_at' => now(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ServerStatus::Rejected,
            'rejection_reason' => fake()->sentence(),
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'featured_until' => now()->addMonth(),
        ]);
    }

    public function offline(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_online' => false,
            'current_players' => 0,
        ]);
    }
}

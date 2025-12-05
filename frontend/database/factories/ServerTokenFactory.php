<?php

namespace Database\Factories;

use App\Models\Server;
use App\Models\ServerToken;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ServerToken>
 */
class ServerTokenFactory extends Factory
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
            'token' => ServerToken::generateToken(),
            'name' => 'Default',
            'pairing_code' => null,
            'pairing_expires_at' => null,
            'is_paired' => false,
            'paired_at' => null,
            'is_active' => true,
        ];
    }

    public function paired(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_paired' => true,
            'paired_at' => now(),
            'pairing_code' => null,
            'pairing_expires_at' => null,
        ]);
    }

    public function withPairingCode(): static
    {
        return $this->state(fn (array $attributes) => [
            'pairing_code' => ServerToken::generatePairingCode(),
            'pairing_expires_at' => now()->addMinutes(15),
        ]);
    }

    public function revoked(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
            'revoked_at' => now(),
        ]);
    }
}

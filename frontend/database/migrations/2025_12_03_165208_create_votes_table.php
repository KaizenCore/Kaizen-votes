<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('server_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Minecraft verification
            $table->string('minecraft_username', 16);
            $table->uuid('minecraft_uuid')->nullable();

            // Vote tracking
            $table->string('ip_address', 45);
            $table->string('user_agent')->nullable();

            // Reward tracking
            $table->boolean('claimed')->default(false);
            $table->timestamp('claimed_at')->nullable();
            $table->json('claimed_rewards')->nullable();

            $table->timestamps();

            // Indexes for cooldown checking and queries
            $table->index(['server_id', 'user_id', 'created_at']);
            $table->index(['server_id', 'minecraft_username', 'created_at']);
            $table->index(['server_id', 'claimed']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};

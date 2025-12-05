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
        Schema::create('servers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();

            // Server Information
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('banner_url')->nullable();

            // Connection Details
            $table->string('ip_address');
            $table->unsignedSmallInteger('port')->default(25565);

            // External Links
            $table->string('website_url')->nullable();
            $table->string('discord_url')->nullable();
            $table->string('discord_webhook_url')->nullable();

            // Server Status
            $table->string('status')->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();

            // Stats (cached/updated periodically)
            $table->unsignedInteger('total_votes')->default(0);
            $table->unsignedInteger('monthly_votes')->default(0);
            $table->unsignedSmallInteger('current_players')->default(0);
            $table->unsignedSmallInteger('max_players')->default(0);
            $table->decimal('tps', 4, 2)->nullable();
            $table->boolean('is_online')->default(false);
            $table->timestamp('last_ping_at')->nullable();

            // Feature Flags
            $table->boolean('is_featured')->default(false);
            $table->timestamp('featured_until')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['status', 'is_online']);
            $table->index('total_votes');
            $table->index('monthly_votes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servers');
    }
};

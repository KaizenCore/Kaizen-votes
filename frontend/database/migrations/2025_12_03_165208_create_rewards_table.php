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
        Schema::create('rewards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('server_id')->constrained()->cascadeOnDelete();

            $table->string('name');
            $table->text('description')->nullable();
            $table->string('reward_type');
            $table->json('commands');
            $table->unsignedInteger('chance')->default(100);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);

            // Optional constraints
            $table->unsignedInteger('min_votes')->nullable();
            $table->unsignedInteger('daily_limit')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rewards');
    }
};

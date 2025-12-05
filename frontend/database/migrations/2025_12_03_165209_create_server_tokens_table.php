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
        Schema::create('server_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('server_id')->constrained()->cascadeOnDelete();

            // API Token (hashed)
            $table->string('token', 64)->unique();
            $table->string('name')->default('Default');

            // Pairing workflow
            $table->string('pairing_code', 8)->nullable();
            $table->timestamp('pairing_expires_at')->nullable();
            $table->boolean('is_paired')->default(false);
            $table->timestamp('paired_at')->nullable();

            // Usage tracking
            $table->timestamp('last_used_at')->nullable();
            $table->string('last_used_ip', 45)->nullable();
            $table->unsignedBigInteger('request_count')->default(0);

            // Token status
            $table->boolean('is_active')->default(true);
            $table->timestamp('revoked_at')->nullable();

            $table->timestamps();

            $table->index(['pairing_code', 'pairing_expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('server_tokens');
    }
};

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
        Schema::table('servers', function (Blueprint $table) {
            // Server software: vanilla, paper, spigot, fabric, forge, purpur, etc.
            $table->string('server_software')->nullable()->after('minecraft_versions');

            // Server location (country code)
            $table->string('country', 2)->nullable()->after('server_software');

            // Primary language
            $table->string('language', 10)->nullable()->after('country');

            // Premium/Cracked - does server accept non-premium accounts
            $table->boolean('accepts_cracked')->default(false)->after('language');

            // Whitelist status
            $table->boolean('is_whitelisted')->default(false)->after('accepts_cracked');

            // Minimum age requirement (null = no restriction)
            $table->unsignedTinyInteger('minimum_age')->nullable()->after('is_whitelisted');

            // Server creation/founded date
            $table->date('founded_at')->nullable()->after('minimum_age');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('servers', function (Blueprint $table) {
            $table->dropColumn([
                'server_software',
                'country',
                'language',
                'accepts_cracked',
                'is_whitelisted',
                'minimum_age',
                'founded_at',
            ]);
        });
    }
};

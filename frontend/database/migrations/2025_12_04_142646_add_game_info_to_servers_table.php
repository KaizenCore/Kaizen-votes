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
            // Server type: java, bedrock, or crossplay (both)
            $table->string('server_type')->default('java')->after('port');

            // Bedrock port (different from Java port, default 19132)
            $table->unsignedSmallInteger('bedrock_port')->nullable()->after('server_type');

            // Modded server info
            $table->boolean('is_modded')->default(false)->after('bedrock_port');
            $table->string('modpack_name')->nullable()->after('is_modded');
            $table->string('modpack_url')->nullable()->after('modpack_name');
            $table->string('launcher')->nullable()->after('modpack_url');

            // Minecraft versions supported (stored as JSON array)
            $table->json('minecraft_versions')->nullable()->after('launcher');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('servers', function (Blueprint $table) {
            $table->dropColumn([
                'server_type',
                'bedrock_port',
                'is_modded',
                'modpack_name',
                'modpack_url',
                'launcher',
                'minecraft_versions',
            ]);
        });
    }
};

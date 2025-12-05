<?php

use App\Http\Controllers\Api\MinecraftController;
use App\Http\Controllers\Api\V1\ServerPairingController;
use App\Http\Controllers\Api\V1\ServerStatsController;
use App\Http\Controllers\Api\V1\VoteApiController;
use Illuminate\Support\Facades\Route;

// Minecraft profile validation
Route::get('minecraft/profile/{username}', [MinecraftController::class, 'profile'])
    ->middleware('throttle:120,1')
    ->name('api.minecraft.profile');

Route::get('minecraft/uuid/{uuid}', [MinecraftController::class, 'profileByUuid'])
    ->middleware('throttle:120,1')
    ->name('api.minecraft.uuid');

Route::prefix('v1')->name('api.v1.')->group(function () {
    // Public endpoint for pairing (with rate limiting)
    Route::post('servers/pair', [ServerPairingController::class, 'pair'])
        ->middleware('throttle:60,1')
        ->name('servers.pair');

    // Authenticated plugin endpoints (server token required)
    Route::middleware('auth.server-token')->group(function () {
        // Vote endpoints
        Route::get('servers/{server}/votes/pending', [VoteApiController::class, 'pending'])
            ->name('servers.votes.pending');
        Route::get('servers/{server}/votes/bulk', [VoteApiController::class, 'bulkPending'])
            ->name('servers.votes.bulk');
        Route::post('votes/{vote}/claim', [VoteApiController::class, 'claim'])
            ->name('votes.claim');

        // Server stats endpoints
        Route::post('servers/{server}/stats', [ServerStatsController::class, 'update'])
            ->name('servers.stats.update');
        Route::get('servers/{server}/leaderboard', [ServerStatsController::class, 'leaderboard'])
            ->name('servers.leaderboard');
        Route::get('servers/{server}/summary', [ServerStatsController::class, 'summary'])
            ->name('servers.summary');
    });
});

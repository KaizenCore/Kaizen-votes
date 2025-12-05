<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Server;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServerStatsController extends Controller
{
    /**
     * Update server status/stats from the plugin.
     */
    public function update(Request $request, Server $server): JsonResponse
    {
        // Get the authenticated server from middleware
        $authenticatedServer = $request->attributes->get('server');

        // Verify the token belongs to this server
        if ($authenticatedServer->id !== $server->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'is_online' => ['sometimes', 'boolean'],
            'current_players' => ['sometimes', 'integer', 'min:0'],
            'players_online' => ['sometimes', 'integer', 'min:0'], // Plugin uses this field name
            'max_players' => ['sometimes', 'integer', 'min:0'],
            'tps' => ['sometimes', 'numeric', 'min:0', 'max:20'],
            'minecraft_version' => ['sometimes', 'string', 'max:50'],
            'version' => ['sometimes', 'string', 'max:50'], // Plugin uses this field name
            'motd' => ['sometimes', 'string', 'max:500'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $updateData = [
            'last_ping_at' => now(),
            'is_online' => true, // If plugin is sending stats, server is online
        ];

        // Accept both current_players and players_online (plugin uses players_online)
        if ($request->has('current_players')) {
            $updateData['current_players'] = $request->integer('current_players');
        } elseif ($request->has('players_online')) {
            $updateData['current_players'] = $request->integer('players_online');
        }

        if ($request->has('max_players')) {
            $updateData['max_players'] = $request->integer('max_players');
        }

        if ($request->has('tps')) {
            $updateData['tps'] = $request->float('tps');
        }

        $server->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Server stats updated',
            'data' => [
                'server_id' => $server->id,
                'is_online' => $server->is_online,
            ],
        ]);
    }

    /**
     * Get server leaderboard (top voters).
     * Returns a direct array for plugin compatibility.
     */
    public function leaderboard(Request $request, Server $server): JsonResponse
    {
        // Get the authenticated server from middleware
        $authenticatedServer = $request->attributes->get('server');

        // Verify the token belongs to this server
        if ($authenticatedServer->id !== $server->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $period = $request->get('period', 'monthly');
        $limit = min($request->integer('per_page', $request->integer('limit', 10)), 100);

        $query = $server->votes()
            ->selectRaw('minecraft_username, minecraft_uuid, COUNT(*) as vote_count, MAX(created_at) as last_vote_at')
            ->groupBy('minecraft_username', 'minecraft_uuid')
            ->orderByDesc('vote_count')
            ->limit($limit);

        // Apply period filter
        match ($period) {
            'daily' => $query->whereDate('created_at', today()),
            'weekly' => $query->where('created_at', '>=', now()->startOfWeek()),
            'monthly' => $query->where('created_at', '>=', now()->startOfMonth()),
            'yearly' => $query->where('created_at', '>=', now()->startOfYear()),
            default => null, // 'all' - no filter
        };

        $leaderboard = $query->get();

        // Return direct array for plugin compatibility
        return response()->json($leaderboard->map(fn ($entry, $index) => [
            'position' => $index + 1,
            'player_uuid' => $entry->minecraft_uuid,
            'player_name' => $entry->minecraft_username,
            'votes' => (int) $entry->vote_count,
            'last_vote' => $entry->last_vote_at ? strtotime($entry->last_vote_at) * 1000 : 0,
        ])->values());
    }

    /**
     * Get server statistics summary.
     */
    public function summary(Request $request, Server $server): JsonResponse
    {
        // Get the authenticated server from middleware
        $authenticatedServer = $request->attributes->get('server');

        if ($authenticatedServer->id !== $server->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'server' => [
                    'id' => $server->id,
                    'name' => $server->name,
                    'slug' => $server->slug,
                    'is_online' => $server->is_online,
                ],
                'votes' => [
                    'today' => $server->votes()->whereDate('created_at', today())->count(),
                    'this_week' => $server->votes()->where('created_at', '>=', now()->startOfWeek())->count(),
                    'this_month' => $server->monthly_votes,
                    'total' => $server->total_votes,
                    'pending_claims' => $server->votes()->unclaimed()->count(),
                ],
            ],
        ]);
    }
}

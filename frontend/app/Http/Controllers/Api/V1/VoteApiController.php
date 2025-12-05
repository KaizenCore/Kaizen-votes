<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Server;
use App\Models\Vote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VoteApiController extends Controller
{
    /**
     * Get pending (unclaimed) votes for a server.
     * Returns a direct array for plugin compatibility.
     */
    public function pending(Request $request, Server $server): JsonResponse
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

        // Filter by player UUID if provided
        $query = $server->votes()
            ->unclaimed()
            ->orderBy('created_at', 'asc')
            ->limit(100);

        if ($request->has('player')) {
            $query->where('minecraft_uuid', $request->get('player'));
        }

        $votes = $query->get();

        // Return direct array for plugin compatibility
        return response()->json($votes->map(fn ($vote) => [
            'id' => (string) $vote->id,
            'player_uuid' => $vote->minecraft_uuid,
            'player_name' => $vote->minecraft_username,
            'service_name' => 'Kaizen Votes',
            'timestamp' => $vote->created_at->getTimestampMs(),
            'claimed' => (bool) $vote->claimed,
            'rewards' => [],
        ])->values());
    }

    /**
     * Mark a vote as claimed and process rewards.
     */
    public function claim(Request $request, Vote $vote): JsonResponse
    {
        // Get the authenticated server from middleware
        $authenticatedServer = $request->attributes->get('server');

        // Verify the vote belongs to the authenticated server
        if ($authenticatedServer->id !== $vote->server_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        // Check if already claimed
        if ($vote->claimed) {
            return response()->json([
                'success' => false,
                'message' => 'Vote already claimed',
            ], 409);
        }

        // Get earned rewards from pre-calculated list (set at vote time)
        $earnedRewardIds = $vote->earned_rewards ?? [];

        // Get full reward data for the earned rewards
        $earnedRewards = $vote->server->rewards()
            ->whereIn('id', $earnedRewardIds)
            ->active()
            ->orderBy('sort_order')
            ->get();

        // Process commands with placeholder replacement
        $commands = $earnedRewards->flatMap(function ($reward) use ($vote) {
            return $reward->getProcessedCommands($vote->minecraft_username);
        })->toArray();

        // Mark as claimed
        $vote->markAsClaimed($earnedRewards->pluck('id')->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Vote claimed successfully',
            'data' => [
                'vote_id' => $vote->id,
                'minecraft_username' => $vote->minecraft_username,
                'rewards' => $earnedRewards->map(fn ($r) => [
                    'id' => $r->id,
                    'name' => $r->name,
                    'type' => $r->reward_type->value,
                ]),
                'commands' => $commands,
            ],
        ]);
    }

    /**
     * Get all unclaimed votes for bulk processing.
     * Returns a direct array for plugin compatibility.
     */
    public function bulkPending(Request $request, Server $server): JsonResponse
    {
        // Get the authenticated server from middleware
        $authenticatedServer = $request->attributes->get('server');

        if ($authenticatedServer->id !== $server->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $votes = $server->votes()
            ->unclaimed()
            ->orderBy('created_at', 'asc')
            ->get();

        // Return direct array for plugin compatibility
        return response()->json($votes->map(fn ($vote) => [
            'id' => (string) $vote->id,
            'player_uuid' => $vote->minecraft_uuid,
            'player_name' => $vote->minecraft_username,
            'service_name' => 'Kaizen Votes',
            'timestamp' => $vote->created_at->getTimestampMs(),
            'claimed' => (bool) $vote->claimed,
            'rewards' => [],
        ])->values());
    }
}

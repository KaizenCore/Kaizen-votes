<?php

namespace App\Http\Controllers;

use App\Models\Server;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    /**
     * Toggle favorite status for a server.
     */
    public function toggle(Request $request, Server $server): JsonResponse
    {
        $user = $request->user();
        $isFavorited = $user->toggleFavorite($server);

        return response()->json([
            'favorited' => $isFavorited,
            'message' => $isFavorited ? 'Server added to favorites' : 'Server removed from favorites',
        ]);
    }

    /**
     * Display the user's favorite servers.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $favorites = $user->favoriteServers()
            ->with(['category', 'tags'])
            ->withCount('votes')
            ->latest('favorites.created_at')
            ->paginate(12);

        return Inertia::render('profile/favorites', [
            'favorites' => $favorites,
        ]);
    }

    /**
     * Check if a server is favorited by the current user.
     */
    public function check(Request $request, Server $server): JsonResponse
    {
        $user = $request->user();
        $isFavorited = $user ? $user->hasFavorited($server) : false;

        return response()->json([
            'favorited' => $isFavorited,
        ]);
    }
}

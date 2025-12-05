<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class MinecraftController extends Controller
{
    /**
     * Get Minecraft profile by username.
     * Proxies the Mojang API to avoid CORS issues.
     */
    public function profile(string $username): JsonResponse
    {
        // Validate username format
        if (! preg_match('/^[a-zA-Z0-9_]{3,16}$/', $username)) {
            return response()->json(['error' => 'Invalid username format'], 400);
        }

        // Cache the result for 1 hour to reduce API calls
        $cacheKey = 'minecraft_profile_'.strtolower($username);

        $profile = Cache::remember($cacheKey, 3600, function () use ($username) {
            try {
                $response = Http::timeout(5)
                    ->get("https://api.mojang.com/users/profiles/minecraft/{$username}");

                if ($response->successful()) {
                    return $response->json();
                }

                return null;
            } catch (\Exception $e) {
                return null;
            }
        });

        if ($profile) {
            return response()->json($profile);
        }

        return response()->json(['error' => 'Profile not found'], 404);
    }

    /**
     * Get Minecraft profile by UUID.
     */
    public function profileByUuid(string $uuid): JsonResponse
    {
        // Remove dashes from UUID if present
        $uuid = str_replace('-', '', $uuid);

        // Validate UUID format
        if (! preg_match('/^[a-fA-F0-9]{32}$/', $uuid)) {
            return response()->json(['error' => 'Invalid UUID format'], 400);
        }

        // Cache the result for 1 hour
        $cacheKey = 'minecraft_uuid_'.$uuid;

        $profile = Cache::remember($cacheKey, 3600, function () use ($uuid) {
            try {
                $response = Http::timeout(5)
                    ->get("https://sessionserver.mojang.com/session/minecraft/profile/{$uuid}");

                if ($response->successful()) {
                    return $response->json();
                }

                return null;
            } catch (\Exception $e) {
                return null;
            }
        });

        if ($profile) {
            return response()->json($profile);
        }

        return response()->json(['error' => 'Profile not found'], 404);
    }
}

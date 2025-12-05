<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Server;
use App\Models\ServerToken;
use App\Services\DiscordWebhookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServerPairingController extends Controller
{
    public function __construct(
        private DiscordWebhookService $discordService
    ) {}

    /**
     * Pair a Minecraft server with its token using a pairing code.
     */
    public function pair(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'pairing_code' => ['required', 'string', 'min:6', 'max:8'],
            'server_ip' => ['nullable', 'string', 'max:255'],
            'server_port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'minecraft_version' => ['nullable', 'string', 'max:50'],
            'plugin_version' => ['nullable', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $token = ServerToken::where('pairing_code', strtoupper($request->pairing_code))
            ->where('is_active', true)
            ->where('is_paired', false)
            ->where('pairing_expires_at', '>', now())
            ->first();

        if (! $token) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired pairing code',
            ], 404);
        }

        // Mark token as paired
        $token->update([
            'is_paired' => true,
            'paired_at' => now(),
            'pairing_code' => null,
            'pairing_expires_at' => null,
            'last_used_at' => now(),
        ]);

        // Update server info if provided
        $server = $token->server;
        if ($request->filled('server_ip')) {
            $server->update([
                'ip_address' => $request->server_ip,
                'port' => $request->server_port ?? 25565,
            ]);
        }

        // Send Discord notification if webhook is configured
        if ($server->discord_webhook_url) {
            $this->discordService->sendPairingNotification(
                $server->discord_webhook_url,
                $server->name
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Server paired successfully',
            'data' => [
                'token' => $token->token,
                'server' => [
                    'id' => $server->id,
                    'name' => $server->name,
                    'slug' => $server->slug,
                ],
            ],
        ]);
    }
}

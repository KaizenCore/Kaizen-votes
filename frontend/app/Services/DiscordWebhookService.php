<?php

namespace App\Services;

use App\Models\Vote;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DiscordWebhookService
{
    /**
     * Send a vote notification to Discord.
     */
    public function sendVoteNotification(Vote $vote): bool
    {
        $server = $vote->server;

        if (! $server->discord_webhook_url) {
            return false;
        }

        try {
            $response = Http::post($server->discord_webhook_url, [
                'embeds' => [[
                    'title' => 'New Vote Received!',
                    'description' => "**{$vote->minecraft_username}** just voted for {$server->name}!",
                    'color' => 0x22C55E, // Green
                    'fields' => [
                        [
                            'name' => 'Total Votes Today',
                            'value' => (string) $server->votes()->whereDate('created_at', today())->count(),
                            'inline' => true,
                        ],
                        [
                            'name' => 'Monthly Votes',
                            'value' => (string) $server->monthly_votes,
                            'inline' => true,
                        ],
                    ],
                    'footer' => [
                        'text' => 'Kaizen Votes',
                    ],
                    'timestamp' => now()->toIso8601String(),
                ]],
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::warning('Failed to send Discord webhook', [
                'server_id' => $server->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Send a server pairing notification to Discord.
     */
    public function sendPairingNotification(string $webhookUrl, string $serverName): bool
    {
        try {
            $response = Http::post($webhookUrl, [
                'embeds' => [[
                    'title' => 'Server Connected!',
                    'description' => "**{$serverName}** has been successfully connected to Kaizen Votes!",
                    'color' => 0x3B82F6, // Blue
                    'footer' => [
                        'text' => 'Kaizen Votes',
                    ],
                    'timestamp' => now()->toIso8601String(),
                ]],
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::warning('Failed to send Discord pairing webhook', [
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}

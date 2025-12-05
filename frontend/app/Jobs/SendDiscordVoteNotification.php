<?php

namespace App\Jobs;

use App\Models\Server;
use App\Models\Vote;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendDiscordVoteNotification implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 30;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Vote $vote,
        public Server $server
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if (empty($this->server->discord_webhook_url)) {
            return;
        }

        $embed = [
            'title' => 'New Vote Received!',
            'description' => "**{$this->vote->minecraft_username}** voted for **{$this->server->name}**!",
            'color' => 0x5865F2, // Discord blurple
            'fields' => [
                [
                    'name' => 'Player',
                    'value' => $this->vote->minecraft_username,
                    'inline' => true,
                ],
                [
                    'name' => 'Monthly Votes',
                    'value' => (string) $this->server->monthly_votes,
                    'inline' => true,
                ],
                [
                    'name' => 'Total Votes',
                    'value' => (string) $this->server->total_votes,
                    'inline' => true,
                ],
            ],
            'timestamp' => $this->vote->created_at->toISOString(),
            'footer' => [
                'text' => 'Kaizen Votes',
            ],
        ];

        // Add player avatar from Crafatar
        if ($this->vote->minecraft_uuid) {
            $embed['thumbnail'] = [
                'url' => "https://crafatar.com/avatars/{$this->vote->minecraft_uuid}?size=64&overlay",
            ];
        }

        try {
            $response = Http::post($this->server->discord_webhook_url, [
                'embeds' => [$embed],
            ]);

            if (! $response->successful()) {
                Log::warning('Discord webhook failed', [
                    'server_id' => $this->server->id,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Discord webhook error', [
                'server_id' => $this->server->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}

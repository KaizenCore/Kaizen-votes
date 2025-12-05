<?php

namespace App\Events;

use App\Models\Server;
use App\Models\Vote;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VoteReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Vote $vote,
        public Server $server
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('servers.'.$this->server->id),
            new Channel('votes'),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'vote' => [
                'id' => $this->vote->id,
                'minecraft_username' => $this->vote->minecraft_username,
                'created_at' => $this->vote->created_at->toISOString(),
            ],
            'server' => [
                'id' => $this->server->id,
                'name' => $this->server->name,
                'slug' => $this->server->slug,
                'monthly_votes' => $this->server->monthly_votes,
                'total_votes' => $this->server->total_votes,
            ],
        ];
    }
}

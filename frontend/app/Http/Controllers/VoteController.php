<?php

namespace App\Http\Controllers;

use App\Http\Requests\Vote\StoreVoteRequest;
use App\Models\Server;
use App\Services\VoteService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VoteController extends Controller
{
    public function __construct(
        private VoteService $voteService
    ) {}

    /**
     * Show the voting form for a server.
     */
    public function create(Server $server): Response
    {
        if (! $server->isApproved()) {
            abort(404);
        }

        $user = request()->user();
        $canVote = $this->voteService->canVote($server, $user);
        $cooldownRemaining = $this->voteService->getCooldownRemaining($server, $user);

        // Get available rewards to show before voting
        $availableRewards = $server->rewards()->active()->orderBy('sort_order')->get();

        // Get user's previous Minecraft usernames (most recent first)
        $previousUsernames = $user->votes()
            ->select('minecraft_username')
            ->distinct()
            ->orderByDesc('created_at')
            ->limit(5)
            ->pluck('minecraft_username')
            ->toArray();

        return Inertia::render('servers/vote', [
            'server' => $server->only(['id', 'name', 'slug', 'banner_url']),
            'canVote' => $canVote,
            'cooldownRemaining' => $cooldownRemaining,
            'availableRewards' => $availableRewards,
            'savedMinecraftUsername' => $user->minecraft_username,
            'previousUsernames' => $previousUsernames,
        ]);
    }

    /**
     * Process a vote submission.
     */
    public function store(StoreVoteRequest $request, Server $server): RedirectResponse
    {
        if (! $server->isApproved()) {
            abort(404);
        }

        $minecraftUsername = $request->validated('minecraft_username');

        $vote = $this->voteService->createVote(
            server: $server,
            user: $request->user(),
            minecraftUsername: $minecraftUsername,
            request: $request
        );

        // Save minecraft username to user profile for future votes
        if ($request->user()->minecraft_username !== $minecraftUsername) {
            $request->user()->update(['minecraft_username' => $minecraftUsername]);
        }

        return redirect()
            ->route('votes.success', [$server, $vote])
            ->with('success', 'Vote submitted successfully!');
    }

    /**
     * Show thank you / confirmation page.
     */
    public function success(Server $server, int $voteId): Response
    {
        $vote = $server->votes()->where('id', $voteId)->firstOrFail();

        // Ensure the vote belongs to the current user
        if ($vote->user_id !== request()->user()->id) {
            abort(403);
        }

        // Get only the rewards that were actually earned for this vote
        $earnedRewardIds = $vote->earned_rewards ?? [];
        $earnedRewards = $server->rewards()
            ->whereIn('id', $earnedRewardIds)
            ->get();

        return Inertia::render('servers/vote-success', [
            'server' => $server->only(['id', 'name', 'slug', 'banner_url']),
            'vote' => [
                'id' => $vote->id,
                'minecraft_username' => $vote->minecraft_username,
                'created_at' => $vote->created_at->format('M d, Y H:i'),
                'streak' => $vote->streak,
            ],
            'earnedRewards' => $earnedRewards,
        ]);
    }
}

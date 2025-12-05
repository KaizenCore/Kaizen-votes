<?php

namespace App\Services;

use App\Events\VoteReceived;
use App\Jobs\SendDiscordVoteNotification;
use App\Models\Server;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Http\Request;

class VoteService
{
    public function createVote(
        Server $server,
        User $user,
        string $minecraftUsername,
        Request $request
    ): Vote {
        // Calculate earned rewards at vote time
        $earnedRewards = $this->calculateEarnedRewards($server, $minecraftUsername);

        // Calculate streak
        $streak = $this->calculateStreak($server, $minecraftUsername);

        $vote = Vote::create([
            'server_id' => $server->id,
            'user_id' => $user->id,
            'minecraft_username' => $minecraftUsername,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'earned_rewards' => $earnedRewards,
            'streak' => $streak,
        ]);

        // Update server vote counts
        $this->updateServerVoteStats($server);

        // Refresh server to get updated vote counts
        $server->refresh();

        // Broadcast vote received event (for real-time updates)
        VoteReceived::dispatch($vote, $server);

        // Queue Discord notification if webhook is configured
        if ($server->discord_webhook_url) {
            SendDiscordVoteNotification::dispatch($vote, $server);
        }

        return $vote;
    }

    /**
     * Calculate which rewards a player earns based on chance, min_votes, and daily_limit.
     *
     * @return array<int> Array of reward IDs
     */
    public function calculateEarnedRewards(Server $server, string $minecraftUsername): array
    {
        $rewards = $server->rewards()->active()->orderBy('sort_order')->get();

        if ($rewards->isEmpty()) {
            return [];
        }

        // Get player's total vote count for min_votes check (count ALL votes, not just claimed)
        $playerVoteCount = $server->votes()
            ->where('minecraft_username', $minecraftUsername)
            ->count() + 1; // +1 for the current vote being created

        // Count rewards given today for daily_limit check
        $today = now()->startOfDay();
        $rewardsGivenToday = $server->votes()
            ->where('claimed', true)
            ->where('claimed_at', '>=', $today)
            ->pluck('claimed_rewards')
            ->flatten()
            ->countBy()
            ->toArray();

        // Determine which rewards to give based on chance, min_votes, and daily_limit
        $earnedRewards = $rewards->filter(function ($reward) use ($playerVoteCount, $rewardsGivenToday) {
            // Check min_votes requirement
            if ($reward->min_votes !== null && $playerVoteCount < $reward->min_votes) {
                return false;
            }

            // Check daily_limit
            if ($reward->daily_limit !== null) {
                $givenToday = $rewardsGivenToday[$reward->id] ?? 0;
                if ($givenToday >= $reward->daily_limit) {
                    return false;
                }
            }

            // Check chance (rand returns 1-100, if chance is 50, ~50% of 1-100 are <= 50)
            return $reward->chance >= 100 || rand(1, 100) <= $reward->chance;
        });

        return $earnedRewards->pluck('id')->toArray();
    }

    public function canVote(Server $server, User $user): bool
    {
        if (! $server->canReceiveVotes()) {
            return false;
        }

        // Admins bypass cooldown
        if ($user->isAdmin()) {
            return true;
        }

        return ! $this->hasCooldown($server, $user);
    }

    public function hasCooldown(Server $server, User $user): bool
    {
        // Admins never have cooldown
        if ($user->isAdmin()) {
            return false;
        }

        return Vote::where('server_id', $server->id)
            ->where('user_id', $user->id)
            ->where('created_at', '>=', now()->subHours(24))
            ->exists();
    }

    public function getCooldownRemaining(Server $server, User $user): ?int
    {
        // Admins never have cooldown
        if ($user->isAdmin()) {
            return null;
        }

        $lastVote = Vote::where('server_id', $server->id)
            ->where('user_id', $user->id)
            ->latest()
            ->first();

        if (! $lastVote) {
            return null;
        }

        $cooldownEnds = $lastVote->created_at->addHours(24);

        if ($cooldownEnds->isPast()) {
            return null;
        }

        return now()->diffInSeconds($cooldownEnds);
    }

    public function updateServerVoteStats(Server $server): void
    {
        $server->update([
            'total_votes' => $server->votes()->count(),
            'monthly_votes' => $server->votes()
                ->where('created_at', '>=', now()->startOfMonth())
                ->count(),
        ]);
    }

    /**
     * Get top voters for a server.
     *
     * @return \Illuminate\Support\Collection<int, object>
     */
    public function getTopVoters(Server $server, string $period = 'monthly', int $limit = 10)
    {
        $query = $server->votes()
            ->selectRaw('minecraft_username, COUNT(*) as vote_count')
            ->groupBy('minecraft_username')
            ->orderByDesc('vote_count')
            ->limit($limit);

        if ($period === 'monthly') {
            $query->where('created_at', '>=', now()->startOfMonth());
        } elseif ($period === 'weekly') {
            $query->where('created_at', '>=', now()->startOfWeek());
        }

        return $query->get();
    }

    /**
     * Calculate the current streak for a player on a server.
     * A streak continues if the last vote was between 24-48 hours ago.
     */
    public function calculateStreak(Server $server, string $minecraftUsername): int
    {
        $lastVote = $server->votes()
            ->where('minecraft_username', $minecraftUsername)
            ->latest()
            ->first();

        if (! $lastVote) {
            return 1; // First vote, streak starts at 1
        }

        $hoursSinceLastVote = $lastVote->created_at->diffInHours(now());

        // If last vote was between 24-48 hours ago, continue the streak
        // This allows for the 24h cooldown and gives a grace period
        if ($hoursSinceLastVote >= 24 && $hoursSinceLastVote <= 48) {
            return $lastVote->streak + 1;
        }

        // Streak is broken, start fresh
        return 1;
    }

    /**
     * Get the current streak for a player on a server (without incrementing).
     */
    public function getCurrentStreak(Server $server, string $minecraftUsername): int
    {
        $lastVote = $server->votes()
            ->where('minecraft_username', $minecraftUsername)
            ->latest()
            ->first();

        if (! $lastVote) {
            return 0;
        }

        $hoursSinceLastVote = $lastVote->created_at->diffInHours(now());

        // If within 48 hours, the streak is still valid
        if ($hoursSinceLastVote <= 48) {
            return $lastVote->streak;
        }

        // Streak is broken
        return 0;
    }
}

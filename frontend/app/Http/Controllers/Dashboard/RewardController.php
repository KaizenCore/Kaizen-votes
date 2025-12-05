<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\RewardType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reward\StoreRewardRequest;
use App\Http\Requests\Reward\UpdateRewardRequest;
use App\Models\Reward;
use App\Models\Server;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RewardController extends Controller
{
    /**
     * Display the rewards management page for a server.
     */
    public function index(Server $server): Response
    {
        $this->authorize('update', $server);

        $rewards = $server->rewards()->orderBy('sort_order')->get();

        return Inertia::render('dashboard/servers/rewards', [
            'server' => $server->only(['id', 'name', 'slug']),
            'rewards' => $rewards,
            'rewardTypes' => collect(RewardType::cases())->map(fn ($type) => [
                'value' => $type->value,
                'label' => $type->label(),
            ]),
        ]);
    }

    /**
     * Store a newly created reward.
     */
    public function store(StoreRewardRequest $request, Server $server): RedirectResponse
    {
        $validated = $request->validated();

        // Set sort order to be at the end
        $maxSort = $server->rewards()->max('sort_order') ?? 0;
        $validated['sort_order'] = $maxSort + 1;

        $server->rewards()->create($validated);

        return back()->with('success', 'Reward created successfully!');
    }

    /**
     * Update the specified reward.
     */
    public function update(UpdateRewardRequest $request, Server $server, Reward $reward): RedirectResponse
    {
        // Verify reward belongs to server
        if ($reward->server_id !== $server->id) {
            abort(404);
        }

        $reward->update($request->validated());

        return back()->with('success', 'Reward updated successfully!');
    }

    /**
     * Remove the specified reward.
     */
    public function destroy(Server $server, Reward $reward): RedirectResponse
    {
        $this->authorize('update', $server);

        // Verify reward belongs to server
        if ($reward->server_id !== $server->id) {
            abort(404);
        }

        $reward->delete();

        return back()->with('success', 'Reward deleted successfully!');
    }

    /**
     * Toggle reward active status.
     */
    public function toggle(Server $server, Reward $reward): RedirectResponse
    {
        $this->authorize('update', $server);

        // Verify reward belongs to server
        if ($reward->server_id !== $server->id) {
            abort(404);
        }

        $reward->update(['is_active' => ! $reward->is_active]);

        return back()->with('success', 'Reward status updated!');
    }

    /**
     * Reorder rewards.
     */
    public function reorder(Server $server): RedirectResponse
    {
        $this->authorize('update', $server);

        $order = request()->input('order', []);

        foreach ($order as $index => $rewardId) {
            Reward::where('id', $rewardId)
                ->where('server_id', $server->id)
                ->update(['sort_order' => $index]);
        }

        return back()->with('success', 'Rewards reordered!');
    }
}

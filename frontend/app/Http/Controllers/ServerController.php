<?php

namespace App\Http\Controllers;

use App\Http\Requests\Server\StoreServerRequest;
use App\Http\Requests\Server\UpdateServerRequest;
use App\Models\Category;
use App\Models\Server;
use App\Models\Tag;
use App\Services\VoteService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ServerController extends Controller
{
    public function __construct(
        private VoteService $voteService
    ) {}

    /**
     * Display the server listing page.
     */
    public function index(Request $request): Response
    {
        $query = Server::approved()
            ->with(['category', 'tags']);

        // Filter by category
        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }

        // Filter by tags
        if ($request->filled('tags')) {
            $tags = is_array($request->tags) ? $request->tags : explode(',', $request->tags);
            $query->whereHas('tags', fn ($q) => $q->whereIn('slug', $tags));
        }

        // Search by name
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        // Filter by server type
        if ($request->filled('server_type')) {
            $query->where('server_type', $request->server_type);
        }

        // Filter by modded status
        if ($request->filled('is_modded')) {
            $query->where('is_modded', $request->is_modded === 'true' || $request->is_modded === '1');
        }

        // Filter by cracked status
        if ($request->filled('accepts_cracked')) {
            $query->where('accepts_cracked', $request->accepts_cracked === 'true' || $request->accepts_cracked === '1');
        }

        // Filter by whitelist status
        if ($request->filled('is_whitelisted')) {
            $query->where('is_whitelisted', $request->is_whitelisted === 'true' || $request->is_whitelisted === '1');
        }

        // Sort
        $sort = $request->get('sort', 'votes_month');
        $query->when($sort === 'votes_24h', fn ($q) => $q->orderByDesc('total_votes'))
            ->when($sort === 'votes_month', fn ($q) => $q->orderByDesc('monthly_votes'))
            ->when($sort === 'votes_total', fn ($q) => $q->orderByDesc('total_votes'))
            ->when($sort === 'newest', fn ($q) => $q->orderByDesc('created_at'))
            ->when($sort === 'alphabetical', fn ($q) => $q->orderBy('name'));

        $servers = $query->paginate(12)->withQueryString();

        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $tags = Tag::orderBy('name')->get();

        return Inertia::render('servers/index', [
            'servers' => $servers,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => $request->only(['category', 'tags', 'search', 'sort', 'server_type', 'is_modded', 'accepts_cracked', 'is_whitelisted']),
        ]);
    }

    /**
     * Display a single server's public page.
     */
    public function show(Request $request, Server $server): Response
    {
        // Ensure server is approved or user is owner/admin
        if (! $server->isApproved()) {
            $user = $request->user();
            if (! $user || ($user->id !== $server->user_id && ! $user->isAdmin())) {
                abort(404);
            }
        }

        $server->load(['category', 'tags', 'owner:id,name']);

        $topVoters = $this->voteService->getTopVoters($server, 'monthly', 10);

        $canVote = false;
        $cooldownRemaining = null;

        if ($request->user()) {
            $canVote = $this->voteService->canVote($server, $request->user());
            $cooldownRemaining = $this->voteService->getCooldownRemaining($server, $request->user());
        }

        $isFavorited = false;
        if ($request->user()) {
            $isFavorited = $request->user()->hasFavorited($server);
        }

        return Inertia::render('servers/show', [
            'server' => $server,
            'topVoters' => $topVoters,
            'canVote' => $canVote,
            'cooldownRemaining' => $cooldownRemaining,
            'isFavorited' => $isFavorited,
        ]);
    }

    /**
     * Show the form for creating a new server.
     */
    public function create(): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $tags = Tag::orderBy('name')->get();

        return Inertia::render('servers/create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created server.
     */
    public function store(StoreServerRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $server = Server::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'slug' => Str::slug($validated['name']).'-'.Str::random(6),
            'port' => $validated['port'] ?? 25565,
        ]);

        // Attach tags if provided
        if (isset($validated['tags'])) {
            $server->tags()->attach($validated['tags']);
        }

        return redirect()
            ->route('dashboard.servers.show', $server)
            ->with('success', 'Server submitted for review!');
    }

    /**
     * Show the form for editing a server (owner only).
     */
    public function edit(Server $server): Response
    {
        $this->authorize('update', $server);

        $server->load('tags');

        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $tags = Tag::orderBy('name')->get();

        return Inertia::render('servers/edit', [
            'server' => $server,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified server.
     */
    public function update(UpdateServerRequest $request, Server $server): RedirectResponse
    {
        $validated = $request->validated();

        $server->update($validated);

        // Sync tags if provided
        if (isset($validated['tags'])) {
            $server->tags()->sync($validated['tags']);
        }

        return redirect()
            ->route('dashboard.servers.show', $server)
            ->with('success', 'Server updated successfully!');
    }

    /**
     * Remove the specified server (soft delete).
     */
    public function destroy(Server $server): RedirectResponse
    {
        $this->authorize('delete', $server);

        $server->delete();

        return redirect()
            ->route('dashboard.servers.index')
            ->with('success', 'Server deleted successfully!');
    }
}

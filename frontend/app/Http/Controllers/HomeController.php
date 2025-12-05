<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Server;
use App\Models\Vote;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index(): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->withCount(['servers' => fn ($q) => $q->approved()])
            ->get();

        $featuredServers = Server::approved()
            ->featured()
            ->with(['category', 'tags'])
            ->orderByDesc('monthly_votes')
            ->limit(6)
            ->get();

        $topServers = Server::approved()
            ->with(['category', 'tags'])
            ->orderByDesc('monthly_votes')
            ->limit(10)
            ->get();

        $recentVotes = Vote::with(['server:id,name,slug', 'user:id,name'])
            ->whereHas('server')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn ($vote) => [
                'id' => $vote->id,
                'minecraft_username' => $vote->minecraft_username,
                'server_name' => $vote->server->name,
                'server_slug' => $vote->server->slug,
                'created_at' => $vote->created_at->diffForHumans(),
            ]);

        return Inertia::render('home', [
            'categories' => $categories,
            'featuredServers' => $featuredServers,
            'topServers' => $topServers,
            'recentVotes' => $recentVotes,
        ]);
    }
}

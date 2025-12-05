<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ServerStatus;
use App\Http\Controllers\Controller;
use App\Models\Server;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServerController extends Controller
{
    public function index(): Response
    {
        $servers = Server::with(['owner:id,name,email', 'category:id,name'])
            ->withCount('votes')
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/servers/index', [
            'servers' => $servers,
        ]);
    }

    public function show(Server $server): Response
    {
        $server->load(['owner:id,name,email', 'category', 'tags']);
        $server->loadCount('votes');

        return Inertia::render('admin/servers/show', [
            'server' => $server,
        ]);
    }

    public function approve(Server $server): RedirectResponse
    {
        $server->update([
            'status' => ServerStatus::Approved,
            'approved_at' => now(),
        ]);

        return back()->with('success', "Server '{$server->name}' has been approved.");
    }

    public function reject(Server $server): RedirectResponse
    {
        $server->update([
            'status' => ServerStatus::Rejected,
        ]);

        return back()->with('success', "Server '{$server->name}' has been rejected.");
    }

    public function suspend(Server $server): RedirectResponse
    {
        $server->update([
            'status' => ServerStatus::Suspended,
        ]);

        return back()->with('success', "Server '{$server->name}' has been suspended.");
    }
}

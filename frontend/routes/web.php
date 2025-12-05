<?php

use App\Http\Controllers\Admin\ServerController as AdminServerController;
use App\Http\Controllers\Dashboard\RewardController;
use App\Http\Controllers\Dashboard\ServerTokenController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ServerController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Home page
Route::get('/', [HomeController::class, 'index'])->name('home');

// Public server routes
Route::get('servers', [ServerController::class, 'index'])->name('servers.index');

// Tools
Route::get('tools/banner-generator', function () {
    return Inertia::render('tools/banner-generator');
})->name('tools.banner-generator');

// Server create must be before the slug route
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('servers/create', [ServerController::class, 'create'])->name('servers.create');
});

Route::get('servers/{server:slug}', [ServerController::class, 'show'])->name('servers.show');

// Legacy welcome page (redirect to home)
Route::get('welcome', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('welcome');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', function () {
        $user = request()->user();
        $servers = $user->servers()->with('category')->latest()->limit(5)->get();
        $recentVotes = $user->votes()->with('server:id,name,slug')->latest()->limit(5)->get();

        return Inertia::render('dashboard', [
            'ownedServers' => $servers,
            'recentVotes' => $recentVotes,
        ]);
    })->name('dashboard');

    // User profile with vote history
    Route::get('profile/votes', function () {
        $user = request()->user();

        // Get paginated vote history
        $votes = $user->votes()
            ->with('server:id,name,slug,banner_url,banner_config')
            ->latest()
            ->paginate(20);

        // Get vote statistics
        $totalVotes = $user->votes()->count();
        $votesThisMonth = $user->votes()->where('created_at', '>=', now()->startOfMonth())->count();
        $uniqueServers = $user->votes()->distinct('server_id')->count('server_id');

        // Get most voted servers
        $topServers = $user->votes()
            ->selectRaw('server_id, COUNT(*) as vote_count')
            ->with('server:id,name,slug')
            ->groupBy('server_id')
            ->orderByDesc('vote_count')
            ->limit(5)
            ->get();

        // Get votes per month for the last 6 months
        $monthlyVotes = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $count = $user->votes()
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            $monthlyVotes[] = [
                'month' => $date->format('M Y'),
                'votes' => $count,
            ];
        }

        return Inertia::render('profile/votes', [
            'votes' => $votes,
            'stats' => [
                'totalVotes' => $totalVotes,
                'votesThisMonth' => $votesThisMonth,
                'uniqueServers' => $uniqueServers,
            ],
            'topServers' => $topServers,
            'monthlyVotes' => $monthlyVotes,
        ]);
    })->name('profile.votes');

    // Favorites routes
    Route::get('profile/favorites', [FavoriteController::class, 'index'])->name('profile.favorites');
    Route::post('servers/{server:slug}/favorite', [FavoriteController::class, 'toggle'])->name('servers.favorite.toggle');

    // Voting routes
    Route::get('servers/{server:slug}/vote', [VoteController::class, 'create'])->name('votes.create');
    Route::post('servers/{server:slug}/vote', [VoteController::class, 'store'])->name('votes.store');
    Route::get('servers/{server:slug}/vote/{vote}/success', [VoteController::class, 'success'])->name('votes.success');

    // Server management routes
    Route::post('servers', [ServerController::class, 'store'])->name('servers.store');
    Route::get('servers/{server:slug}/edit', [ServerController::class, 'edit'])->name('servers.edit');
    Route::patch('servers/{server:slug}', [ServerController::class, 'update'])->name('servers.update');
    Route::delete('servers/{server:slug}', [ServerController::class, 'destroy'])->name('servers.destroy');

    // Dashboard server management
    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('servers', function () {
            $servers = request()->user()->servers()
                ->with('category')
                ->withCount('votes')
                ->latest()
                ->get();

            return Inertia::render('dashboard/servers/index', [
                'servers' => $servers,
            ]);
        })->name('servers.index');

        Route::get('servers/{server:slug}', function ($slug) {
            $server = request()->user()->servers()
                ->where('slug', $slug)
                ->with(['category', 'tags', 'tokens', 'rewards'])
                ->withCount('votes')
                ->firstOrFail();

            // Get vote analytics for the last 30 days
            $votesPerDay = $server->votes()
                ->where('created_at', '>=', now()->subDays(30))
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->pluck('count', 'date')
                ->toArray();

            // Fill in missing days with 0
            $analytics = [];
            for ($i = 29; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $analytics[] = [
                    'date' => $date,
                    'votes' => $votesPerDay[$date] ?? 0,
                ];
            }

            // Get top voters this month
            $topVoters = $server->votes()
                ->where('created_at', '>=', now()->startOfMonth())
                ->selectRaw('minecraft_username, COUNT(*) as vote_count')
                ->groupBy('minecraft_username')
                ->orderByDesc('vote_count')
                ->limit(10)
                ->get();

            // Get recent votes
            $recentVotes = $server->votes()
                ->with('user:id,name')
                ->latest()
                ->limit(20)
                ->get();

            // Calculate stats
            $votesLast7Days = $server->votes()->where('created_at', '>=', now()->subDays(7))->count();
            $votesLast30Days = $server->votes()->where('created_at', '>=', now()->subDays(30))->count();
            $uniqueVotersMonth = $server->votes()->where('created_at', '>=', now()->startOfMonth())->distinct('minecraft_username')->count('minecraft_username');

            return Inertia::render('dashboard/servers/show', [
                'server' => $server,
                'analytics' => $analytics,
                'topVoters' => $topVoters,
                'recentVotes' => $recentVotes,
                'stats' => [
                    'votesLast7Days' => $votesLast7Days,
                    'votesLast30Days' => $votesLast30Days,
                    'uniqueVotersMonth' => $uniqueVotersMonth,
                ],
            ]);
        })->name('servers.show');

        // Server token/pairing routes
        Route::post('servers/{server:slug}/tokens', [ServerTokenController::class, 'store'])->name('servers.tokens.store');
        Route::post('servers/{server:slug}/tokens/refresh', [ServerTokenController::class, 'refresh'])->name('servers.tokens.refresh');
        Route::delete('servers/{server:slug}/tokens/{token}', [ServerTokenController::class, 'destroy'])->name('servers.tokens.destroy');

        // Reward routes
        Route::get('servers/{server:slug}/rewards', [RewardController::class, 'index'])->name('servers.rewards.index');
        Route::post('servers/{server:slug}/rewards', [RewardController::class, 'store'])->name('servers.rewards.store');
        Route::patch('servers/{server:slug}/rewards/{reward}', [RewardController::class, 'update'])->name('servers.rewards.update');
        Route::delete('servers/{server:slug}/rewards/{reward}', [RewardController::class, 'destroy'])->name('servers.rewards.destroy');
        Route::post('servers/{server:slug}/rewards/{reward}/toggle', [RewardController::class, 'toggle'])->name('servers.rewards.toggle');
        Route::post('servers/{server:slug}/rewards/reorder', [RewardController::class, 'reorder'])->name('servers.rewards.reorder');
    });
});

// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('servers', [AdminServerController::class, 'index'])->name('servers.index');
    Route::get('servers/{server}', [AdminServerController::class, 'show'])->name('servers.show');
    Route::post('servers/{server}/approve', [AdminServerController::class, 'approve'])->name('servers.approve');
    Route::post('servers/{server}/reject', [AdminServerController::class, 'reject'])->name('servers.reject');
    Route::post('servers/{server}/suspend', [AdminServerController::class, 'suspend'])->name('servers.suspend');
});

require __DIR__.'/settings.php';

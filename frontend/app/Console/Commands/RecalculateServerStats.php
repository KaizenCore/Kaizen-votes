<?php

namespace App\Console\Commands;

use App\Models\Server;
use Illuminate\Console\Command;

class RecalculateServerStats extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'servers:recalculate-stats {--server= : Specific server ID to recalculate}';

    /**
     * The console command description.
     */
    protected $description = 'Recalculate vote statistics for all servers';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $serverId = $this->option('server');

        $query = Server::query();

        if ($serverId) {
            $query->where('id', $serverId);
        }

        $servers = $query->get();

        if ($servers->isEmpty()) {
            $this->warn('No servers found.');

            return self::SUCCESS;
        }

        $this->info("Recalculating stats for {$servers->count()} server(s)...");

        $bar = $this->output->createProgressBar($servers->count());
        $bar->start();

        foreach ($servers as $server) {
            $totalVotes = $server->votes()->count();
            $monthlyVotes = $server->votes()
                ->where('created_at', '>=', now()->startOfMonth())
                ->count();

            $server->update([
                'total_votes' => $totalVotes,
                'monthly_votes' => $monthlyVotes,
            ]);

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Stats recalculated successfully!');

        return self::SUCCESS;
    }
}

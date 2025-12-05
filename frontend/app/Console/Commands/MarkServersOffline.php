<?php

namespace App\Console\Commands;

use App\Models\Server;
use Illuminate\Console\Command;

class MarkServersOffline extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'servers:mark-offline {--minutes=3 : Minutes without ping before marking offline}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark servers as offline if they haven\'t pinged in the specified time';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $minutes = (int) $this->option('minutes');
        $threshold = now()->subMinutes($minutes);

        $count = Server::where('is_online', true)
            ->where(function ($query) use ($threshold) {
                $query->whereNull('last_ping_at')
                    ->orWhere('last_ping_at', '<', $threshold);
            })
            ->update([
                'is_online' => false,
                'current_players' => 0,
            ]);

        if ($count > 0) {
            $this->info("Marked {$count} server(s) as offline.");
        } else {
            $this->info('No servers to mark offline.');
        }

        return Command::SUCCESS;
    }
}

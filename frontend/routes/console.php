<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Mark servers as offline if they haven't pinged in 3 minutes
Schedule::command('servers:mark-offline')->everyMinute();

// Recalculate server vote stats daily (to keep monthly_votes accurate)
Schedule::command('servers:recalculate-stats')->dailyAt('00:05');

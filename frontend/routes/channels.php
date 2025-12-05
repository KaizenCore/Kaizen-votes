<?php

use App\Models\Server;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Server owners can listen to their server's votes
Broadcast::channel('servers.{serverId}', function ($user, $serverId) {
    $server = Server::find($serverId);

    return $server && ($user->id === $server->user_id || $user->isAdmin());
});

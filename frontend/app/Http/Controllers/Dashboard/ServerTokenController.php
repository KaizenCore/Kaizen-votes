<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Server;
use App\Models\ServerToken;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ServerTokenController extends Controller
{
    /**
     * Generate a new pairing code for a server.
     */
    public function store(Request $request, Server $server): RedirectResponse
    {
        $this->authorize('update', $server);

        // Deactivate any existing unpaired tokens
        $server->tokens()
            ->where('is_paired', false)
            ->update(['is_active' => false]);

        // Create new token with pairing code
        ServerToken::create([
            'server_id' => $server->id,
            'token' => ServerToken::generateToken(),
            'pairing_code' => ServerToken::generatePairingCode(),
            'pairing_expires_at' => now()->addMinutes(15),
            'is_paired' => false,
            'is_active' => true,
        ]);

        return back()->with('success', 'Pairing code generated successfully!');
    }

    /**
     * Refresh/regenerate a pairing code.
     */
    public function refresh(Request $request, Server $server): RedirectResponse
    {
        $this->authorize('update', $server);

        $token = $server->tokens()
            ->where('is_active', true)
            ->where('is_paired', false)
            ->first();

        if ($token) {
            $token->generateNewPairingCode();
        } else {
            // Create a new one if none exists
            ServerToken::create([
                'server_id' => $server->id,
                'token' => ServerToken::generateToken(),
                'pairing_code' => ServerToken::generatePairingCode(),
                'pairing_expires_at' => now()->addMinutes(15),
                'is_paired' => false,
                'is_active' => true,
            ]);
        }

        return back()->with('success', 'Pairing code refreshed!');
    }

    /**
     * Revoke a token.
     */
    public function destroy(Request $request, Server $server, ServerToken $token): RedirectResponse
    {
        $this->authorize('update', $server);

        if ($token->server_id !== $server->id) {
            abort(403);
        }

        $token->revoke();

        return back()->with('success', 'Token revoked successfully!');
    }
}

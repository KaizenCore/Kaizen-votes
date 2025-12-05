<?php

namespace App\Http\Middleware;

use App\Models\ServerToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateServerToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json([
                'success' => false,
                'message' => 'No authentication token provided.',
            ], 401);
        }

        $serverToken = ServerToken::where('token', $token)
            ->where('is_active', true)
            ->where('is_paired', true)
            ->first();

        if (! $serverToken) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or revoked token.',
            ], 401);
        }

        // Load the server
        $server = $serverToken->server;

        if (! $server || ! $server->isApproved()) {
            return response()->json([
                'success' => false,
                'message' => 'Server not found or not approved.',
            ], 403);
        }

        // Record usage
        $serverToken->recordUsage($request->ip());

        // Attach to request for controllers
        $request->attributes->set('server', $server);
        $request->attributes->set('server_token', $serverToken);

        return $next($request);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureVendorIsActive
{
    /**
     * Block seller panel until super admin approves (active) or account is not suspended-only landing.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($user === null || ! method_exists($user, 'hasRole')) {
            return $next($request);
        }

        if ($user->hasRole('super_admin')) {
            return $next($request);
        }

        if (! $user->hasRole(['vendor_admin', 'vendor_staff'])) {
            return $next($request);
        }

        $vendor = $user->vendor;
        if ($vendor === null) {
            abort(403, 'No shop profile.');
        }

        if ($vendor->status === 'pending') {
            return redirect()->route('vendor.pending');
        }

        if ($vendor->status === 'suspended') {
            return redirect()->route('vendor.suspended');
        }

        return $next($request);
    }
}

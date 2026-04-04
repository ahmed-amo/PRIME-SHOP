<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;  // Changed from JsonResponse
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse  // Changed return type
    {
        $request->authenticate();
        $request->session()->regenerate();

        /** @var User $user */
        $user = Auth::user();

        return redirect()->intended($this->redirectPathForUser($user));
    }

    protected function redirectPathForUser(User $user): string
    {
        if ($user->hasRole('super_admin')) {
            return route('super_admin.dashboard');
        }

        if ($user->isAdmin()) {
            return route('admin.dashboard');
        }

        if ($user->hasRole(['vendor_admin', 'vendor_staff'])) {
            return route('vendor.dashboard');
        }

        return route('shop');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}

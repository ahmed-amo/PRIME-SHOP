<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeEmail;
use App\Models\User;
use App\Models\Vendor;
use GuzzleHttp\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;

class GoogleController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirect(Request $request): RedirectResponse
    {
        $clientId = (string) config('services.google.client_id', '');
        $clientSecret = (string) config('services.google.client_secret', '');

        if ($clientId === '' || $clientSecret === '') {
            Log::warning('Google OAuth redirect blocked: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the environment.');

            return redirect()->route('login', ['error' => 'google_oauth_missing']);
        }

        $intent = $request->query('intent');
        $intentValue = $intent === 'vendor' ? 'vendor' : 'customer';

        $response = $this->googleDriver()->redirect();

        // Persist intended account type across OAuth roundtrip (Socialite is stateless here).
        // Short-lived, httpOnly cookie.
        return $response->withCookie(cookie()->make(
            'ps_oauth_intent',
            $intentValue,
            10,     // minutes
            null,
            null,
            false,
            true,
            false,
            'Lax',
        ));
    }

    /**
     * Handle Google OAuth callback
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = $this->googleDriver()->user();
            $intent = request()->cookie('ps_oauth_intent') === 'vendor' ? 'vendor' : 'customer';

            $avatarUrl = $googleUser->getAvatar();
            if (is_string($avatarUrl) && $avatarUrl !== '' && str_contains($avatarUrl, 'googleusercontent.com')) {
                $larger = preg_replace('#=s\d+-c#', '=s256-c', $avatarUrl);
                if (is_string($larger)) {
                    $avatarUrl = $larger;
                }
            }

            // Check if user exists by email or google_id
            $user = User::where('email', $googleUser->getEmail())
                ->orWhere('google_id', $googleUser->getId())
                ->first();

            if ($user) {
                if (! $user->google_id) {
                    $user->google_id = $googleUser->getId();
                }
                if ($avatarUrl) {
                    $user->avatar = $avatarUrl;
                }
                $user->save();
                if ($intent === 'customer') {
                    if (! $user->hasRole('customer') && ! $user->hasAnyRole(['super_admin', 'vendor_admin', 'vendor_staff'])) {
                        $user->assignRole('customer');
                    }
                }
            } else {
                // New user: create account
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $avatarUrl,
                    'email_verified_at' => now(), // Google emails are verified
                    'password' => null, // No password for Google users
                    'role' => $intent === 'vendor' ? 'vendor_admin' : 'client',
                ]);

                if ($intent === 'vendor') {
                    $user->assignRole('vendor_admin');
                } else {
                    $user->assignRole('customer');
                }

                try {
                    Mail::to($user->email)->queue(new WelcomeEmail($user));
                } catch (\Throwable $mailException) {
                    Log::warning('Google OAuth: welcome email not queued', [
                        'message' => $mailException->getMessage(),
                        'user_id' => $user->id,
                    ]);
                }
            }

            if ($intent === 'vendor') {
                $this->ensureVendorAccount($user);
            }

            // Log the user into the web guard so Inertia routes see them as authenticated
            Auth::login($user);

            // Create Sanctum personal access token
            $token = $user->createToken('auth-token')->plainTextToken;

            // Redirect to Inertia callback page (served by Laravel)
            return redirect()
                ->route('auth.callback', ['token' => $token, 'intent' => $intent])
                ->withCookie(cookie()->forget('ps_oauth_intent'));

        } catch (\Throwable $e) {
            Log::error('Google OAuth Error', [
                'message' => $e->getMessage(),
                'exception' => $e::class,
            ]);

            return redirect()->route('login', ['error' => 'oauth_failed']);
        }
    }

    private function ensureVendorAccount(User $user): void
    {
        if (method_exists($user, 'hasAnyRole') && ! $user->hasAnyRole(['vendor_admin', 'vendor_staff'])) {
            $user->assignRole('vendor_admin');
        }

        if ($user->role !== 'vendor_admin' && $user->role !== 'vendor_staff') {
            $user->role = 'vendor_admin';
            $user->save();
        }

        if ($user->vendor) {
            return;
        }

        $name = trim((string) $user->name);
        $baseShopName = $name !== '' ? "{$name}'s Shop" : 'My Shop';
        $slugBase = Str::slug($baseShopName);
        if ($slugBase === '') {
            $slugBase = 'shop';
        }

        $slug = $slugBase;
        $n = 2;
        while (Vendor::where('slug', $slug)->exists()) {
            $slug = $slugBase.'-'.$n;
            $n++;
        }

        Vendor::create([
            'user_id' => $user->id,
            'shop_name' => $baseShopName,
            'slug' => $slug,
            'phone' => $user->phone ?? null,
            'description' => null,
            'status' => 'active',
        ]);
    }

    private function googleDriver(): GoogleProvider
    {
        /** @var GoogleProvider $driver */
        $driver = Socialite::driver('google')->stateless();

        $allowInsecure = (bool) config('services.google.oauth_insecure_ssl');
        if ($allowInsecure && ! app()->environment('production')) {
            $driver->setHttpClient(new Client(['verify' => false]));
        }

        return $driver;
    }
}

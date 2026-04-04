<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeEmail;
use App\Models\User;
use GuzzleHttp\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;

class GoogleController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirect(): RedirectResponse
    {
        return $this->googleDriver()->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = $this->googleDriver()->user();

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
                if (! $user->hasRole('customer') && ! $user->hasAnyRole(['super_admin', 'vendor_admin', 'vendor_staff'])) {
                    $user->assignRole('customer');
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
                    'role' => 'user', // Default role
                ]);

                $user->assignRole('customer');

                try {
                    Mail::to($user->email)->queue(new WelcomeEmail($user));
                } catch (\Throwable $mailException) {
                    Log::warning('Google OAuth: welcome email not queued', [
                        'message' => $mailException->getMessage(),
                        'user_id' => $user->id,
                    ]);
                }
            }

            // Log the user into the web guard so Inertia routes see them as authenticated
            Auth::login($user);

            // Create Sanctum personal access token
            $token = $user->createToken('auth-token')->plainTextToken;

            // Redirect to Inertia callback page (served by Laravel)
            return redirect()->route('auth.callback', ['token' => $token]);

        } catch (\Throwable $e) {
            Log::error('Google OAuth Error', [
                'message' => $e->getMessage(),
                'exception' => $e::class,
            ]);

            return redirect()->route('login', ['error' => 'oauth_failed']);
        }
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

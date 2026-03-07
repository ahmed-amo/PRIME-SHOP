<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->stateless()
            ->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->user();

            // Check if user exists by email or google_id
            $user = User::where('email', $googleUser->getEmail())
                ->orWhere('google_id', $googleUser->getId())
                ->first();

            if ($user) {
                // Existing user: update google_id and avatar if not set
                if (!$user->google_id) {
                    $user->google_id = $googleUser->getId();
                }
                if (!$user->avatar && $googleUser->getAvatar()) {
                    $user->avatar = $googleUser->getAvatar();
                }
                $user->save();
            } else {
                // New user: create account
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => now(), // Google emails are verified
                    'password' => null, // No password for Google users
                    'role' => 'user', // Default role
                ]);

                // Dispatch welcome email to queue
                Mail::to($user->email)->queue(new WelcomeEmail($user));
            }

            // Log the user into the web guard so Inertia routes see them as authenticated
            Auth::login($user);

            // Create Sanctum personal access token
            $token = $user->createToken('auth-token')->plainTextToken;

            // Redirect to Inertia callback page (served by Laravel)
            return redirect()->route('auth.callback', ['token' => $token]);

        } catch (\Exception $e) {
            // Log error and redirect to login with error
            Log::error('Google OAuth Error: ' . $e->getMessage());

            return redirect()->route('login', ['error' => 'oauth_failed']);
        }
    }
}

<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Shop\SearchController;

Route::get('/search/suggestions', [SearchController::class, 'suggestions'])
    ->middleware('throttle:120,1');

// Public OAuth routes
Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('auth.google.callback');

// Protected routes (require Sanctum authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        /** @var User $user */
        $user = $request->user();
        return response()->json([
            'user' => [
                ...$user->only([
                    'id',
                    'name',
                    'email',
                    'avatar',
                    'phone',
                    'address',
                    'google_id',
                    'email_verified_at',
                ]),
                'picture' => $user->avatarDisplayUrl(),
                // Always expose an effective role string for frontend role detection.
                'role' => $user->uiRole(),
            ],
        ]);
    })->name('api.user');

    Route::delete('/logout', function (Request $request) {
        // Revoke the current access token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    })->name('api.logout');
});

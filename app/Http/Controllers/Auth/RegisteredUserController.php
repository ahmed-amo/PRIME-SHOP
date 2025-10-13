<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia; // Make sure this is imported

class RegisteredUserController extends Controller
{
    // This method shows the registration form
    public function create()
    {
        return Inertia::render('Auth/Register'); // Adjust this path based on your setup
    }

    // This method handles the registration logic
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client', // Make sure your User model has a role field
        ]);

        event(new Registered($user));

        Auth::login($user);

        return response()->json([
            'redirect' => $user->getRedirectRoute(), // Ensure this method exists in your User model
        ]);
    }
}

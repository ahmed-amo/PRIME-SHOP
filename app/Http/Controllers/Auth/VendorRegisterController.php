<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class VendorRegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/VendorRegister');
    }

    public function store(Request $request): RedirectResponse
    {
        if ($request->user()) {
            return redirect()->route('home')
                ->with('error', 'Log out before creating a seller account with a new email.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Password::defaults()],
            'shop_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:300'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'user',
        ]);

        $user->assignRole('vendor_admin');

        $slug = $this->uniqueSlugFromShopName($validated['shop_name']);

        Vendor::create([
            'user_id' => $user->id,
            'shop_name' => $validated['shop_name'],
            'slug' => $slug,
            'phone' => $validated['phone'] ?? null,
            'description' => $validated['description'] ?? null,
            'status' => 'pending',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('vendor.pending')
            ->with('success', 'Your seller application was submitted. A platform admin will approve your shop shortly.');
    }

    private function uniqueSlugFromShopName(string $shopName): string
    {
        $base = Str::slug($shopName);
        if ($base === '') {
            $base = 'shop';
        }

        if (! Vendor::where('slug', $base)->exists()) {
            return $base;
        }

        $n = 2;
        while (Vendor::where('slug', $base.'-'.$n)->exists()) {
            $n++;
        }

        return $base.'-'.$n;
    }
}

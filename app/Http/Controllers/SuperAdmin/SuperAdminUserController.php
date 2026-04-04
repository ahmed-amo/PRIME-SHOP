<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminUserController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'roles' => $user->getRoleNames()->values()->all(),
                ];
            });

        return Inertia::render('SuperAdmin/Users', [
            'users' => $users,
        ]);
    }
}

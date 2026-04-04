<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ClientsSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            ['name' => 'Client One', 'email' => 'client1@prime_shop.dz'],
            ['name' => 'Client Two', 'email' => 'client2@prime_shop.dz'],
            ['name' => 'Client Three', 'email' => 'client3@prime_shop.dz'],
            ['name' => 'Client Four', 'email' => 'client4@prime_shop.dz'],
            ['name' => 'Client Five', 'email' => 'client5@prime_shop.dz'],
        ];

        foreach ($clients as $client) {
            $user = User::updateOrCreate(
                ['email' => $client['email']],
                [
                    'name' => $client['name'],
                    'password' => Str::password(12),
                    'role' => 'user',
                ]
            );
            if (! $user->hasRole('customer')) {
                $user->assignRole('customer');
            }
        }
    }
}


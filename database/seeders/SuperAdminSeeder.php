<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@prime_shop.dz'],
            [
                'name' => 'Super Admin',
                'password' => 'zmartcs123',
                'role' => 'admin',
            ]
        );
    }
}


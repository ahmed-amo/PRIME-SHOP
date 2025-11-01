<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'password' => 'zmartcs123',
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'client@gmail.com'],
            [
                'name' => 'Client',
                'password' => 'zmartcs123',
                'role' => 'user',
            ]
        );
    }
}

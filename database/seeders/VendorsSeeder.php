<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class VendorsSeeder extends Seeder
{
    /**
     * Three active demo sellers (marketplace). Password for each: "password".
     *
     * @var list<array{email: string, name: string, shop: string, slug: string, phone: string}>
     */
    private const VENDORS = [
        [
            'email' => 'vendor1@prime_shop.dz',
            'name' => 'Souk El Fellah',
            'shop' => 'Souk El Fellah',
            'slug' => 'souk-el-fellah',
            'phone' => '551111111',
        ],
        [
            'email' => 'vendor2@prime_shop.dz',
            'name' => 'Casbah Electronics',
            'shop' => 'Casbah Electronics',
            'slug' => 'casbah-electronics',
            'phone' => '552222222',
        ],
        [
            'email' => 'vendor3@prime_shop.dz',
            'name' => 'Atlas Home & Style',
            'shop' => 'Atlas Home & Style',
            'slug' => 'atlas-home-style',
            'phone' => '553333333',
        ],
    ];

    public function run(): void
    {
        foreach (self::VENDORS as $row) {
            $user = User::query()->updateOrCreate(
                ['email' => $row['email']],
                [
                    'name' => $row['name'],
                    'password' => Hash::make('password'),
                    'role' => 'user',
                    'phone' => $row['phone'],
                    'phone_country_dial' => '213',
                ],
            );

            if (! $user->hasRole('vendor_admin')) {
                $user->assignRole('vendor_admin');
            }

            Vendor::query()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'shop_name' => $row['shop'],
                    'slug' => $row['slug'],
                    'description' => 'Demo seller for local development.',
                    'phone' => $row['phone'],
                    'phone_country_dial' => '213',
                    'status' => 'active',
                ],
            );
        }
    }
}

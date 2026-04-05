<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
{
    $this->call([
        // Roles MUST come first so the users below can use them
        RolesAndPermissionsSeeder::class, 
        SuperAdminSeeder::class,
        ClientsSeeder::class,
        VendorsSeeder::class,
        CategorySeeder::class, // Categories must come before products
        ProductSeeder::class,
        SaleProductsSeeder::class,
    ]);
}
}

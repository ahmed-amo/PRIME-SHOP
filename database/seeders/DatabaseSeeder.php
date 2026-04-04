<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SuperAdminSeeder::class,
            RolesAndPermissionsSeeder::class,
            ClientsSeeder::class,
            VendorsSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            SaleProductsSeeder::class,
        ]);
    }
}

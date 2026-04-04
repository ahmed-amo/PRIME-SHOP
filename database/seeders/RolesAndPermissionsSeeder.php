<?php

namespace Database\Seeders;

/*
|--------------------------------------------------------------------------
| Spatie Laravel Permission — install and migrate before running this seeder
|--------------------------------------------------------------------------
| The package is not currently listed in composer.json. From the project root:
|
|   1. composer require spatie/laravel-permission
|   2. php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
|   3. php artisan migrate
|
| Then run: php artisan db:seed --class=RolesAndPermissionsSeeder
| (or full db:seed after adding Spatie to composer.)
|--------------------------------------------------------------------------
*/

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    private const GUARD = 'web';

    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissionNames = [
            'manage-categories',
            'manage-vendors',
            'manage-users',
            'view-all-orders',
            'manage-own-products',
            'manage-own-orders',
            'manage-own-settings',
            'invite-vendor-staff',
        ];

        foreach ($permissionNames as $name) {
            Permission::firstOrCreate(
                ['name' => $name, 'guard_name' => self::GUARD],
            );
        }

        $superAdmin = Role::firstOrCreate(
            ['name' => 'super_admin', 'guard_name' => self::GUARD],
        );
        $vendorAdmin = Role::firstOrCreate(
            ['name' => 'vendor_admin', 'guard_name' => self::GUARD],
        );
        $vendorStaff = Role::firstOrCreate(
            ['name' => 'vendor_staff', 'guard_name' => self::GUARD],
        );
        $customer = Role::firstOrCreate(
            ['name' => 'customer', 'guard_name' => self::GUARD],
        );

        $superAdmin->syncPermissions([
            'manage-categories',
            'manage-vendors',
            'manage-users',
            'view-all-orders',
        ]);

        $vendorAdmin->syncPermissions([
            'manage-own-products',
            'manage-own-orders',
            'manage-own-settings',
            'invite-vendor-staff',
        ]);

        $vendorStaff->syncPermissions([
            'manage-own-products',
            'manage-own-orders',
        ]);

        $customer->syncPermissions([]);

        $user = User::query()->find(1);
        if ($user !== null) {
            $user->assignRole($superAdmin);
        }
    }
}

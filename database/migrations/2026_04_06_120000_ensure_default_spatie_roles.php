<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Registration and OAuth call assignRole('customer') — roles must exist even when
 * DatabaseSeeder / RolesAndPermissionsSeeder has not been run (e.g. migrate-only deploys).
 */
return new class extends Migration
{
    private const GUARD = 'web';

    public function up(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (['super_admin', 'vendor_admin', 'vendor_staff', 'customer'] as $name) {
            Role::firstOrCreate(
                ['name' => $name, 'guard_name' => self::GUARD],
            );
        }
    }

    public function down(): void
    {
        // Do not drop roles: users may already be assigned.
    }
};

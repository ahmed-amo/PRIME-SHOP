<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Allow super-admin approval flow: pending → active.
     *
     * Notes:
     * - MySQL/MariaDB: Laravel uses native ENUM, so we ALTER the column.
     * - PostgreSQL: Laravel emulates enum via a CHECK constraint (e.g. vendors_status_check),
     *   so we update the constraint + default.
     * - SQLite: enum is stored as a plain string; no ALTER needed.
     */
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement(
                "ALTER TABLE vendors MODIFY COLUMN status ENUM('pending','active','suspended') NOT NULL DEFAULT 'pending'"
            );
        } elseif ($driver === 'pgsql') {
            // Laravel's enum() on Postgres becomes a varchar + CHECK constraint.
            DB::statement("ALTER TABLE vendors DROP CONSTRAINT IF EXISTS vendors_status_check");
            DB::statement("ALTER TABLE vendors ADD CONSTRAINT vendors_status_check CHECK (status IN ('pending','active','suspended'))");
            DB::statement("ALTER TABLE vendors ALTER COLUMN status SET DEFAULT 'pending'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement(
                "ALTER TABLE vendors MODIFY COLUMN status ENUM('active','suspended') NOT NULL DEFAULT 'active'"
            );
        } elseif ($driver === 'pgsql') {
            DB::statement("ALTER TABLE vendors DROP CONSTRAINT IF EXISTS vendors_status_check");
            DB::statement("ALTER TABLE vendors ADD CONSTRAINT vendors_status_check CHECK (status IN ('active','suspended'))");
            DB::statement("ALTER TABLE vendors ALTER COLUMN status SET DEFAULT 'active'");
        }
    }
};

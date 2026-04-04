<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Allow super-admin approval flow: pending → active (MySQL/MariaDB enum).
     * SQLite stores enum as string; no ALTER needed.
     */
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement(
                "ALTER TABLE vendors MODIFY COLUMN status ENUM('pending','active','suspended') NOT NULL DEFAULT 'pending'"
            );
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
        }
    }
};

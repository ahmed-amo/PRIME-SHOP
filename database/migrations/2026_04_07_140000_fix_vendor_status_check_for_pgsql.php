<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * PostgreSQL: Laravel's enum() is a CHECK constraint (often vendors_status_check).
 * Older migrations only modified MySQL enums, leaving Postgres rejecting 'pending'.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'pgsql') {
            return;
        }

        // Drop *any* CHECK constraint that applies to vendors.status, then recreate with pending.
        DB::statement(<<<'SQL'
DO $$
DECLARE
    c record;
BEGIN
    FOR c IN
        SELECT con.conname
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
        JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = ANY (con.conkey)
        WHERE con.contype = 'c'
          AND nsp.nspname = current_schema()
          AND rel.relname = 'vendors'
          AND att.attname = 'status'
    LOOP
        EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT IF EXISTS %I', current_schema(), 'vendors', c.conname);
    END LOOP;

    EXECUTE 'ALTER TABLE vendors ADD CONSTRAINT vendors_status_check CHECK (status IN (''pending'',''active'',''suspended''))';
    EXECUTE 'ALTER TABLE vendors ALTER COLUMN status SET DEFAULT ''pending''';
END $$;
SQL);
    }

    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement(<<<'SQL'
DO $$
BEGIN
    EXECUTE 'ALTER TABLE vendors DROP CONSTRAINT IF EXISTS vendors_status_check';
    EXECUTE 'ALTER TABLE vendors ADD CONSTRAINT vendors_status_check CHECK (status IN (''active'',''suspended''))';
    EXECUTE 'ALTER TABLE vendors ALTER COLUMN status SET DEFAULT ''active''';
END $$;
SQL);
    }
};


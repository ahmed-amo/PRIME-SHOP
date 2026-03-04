<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Allow orders without an associated user (guest checkout)
        DB::statement('ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL');
    }

    public function down(): void
    {
        // Revert to requiring a user for each order
        DB::statement('ALTER TABLE orders ALTER COLUMN user_id SET NOT NULL');
    }
};


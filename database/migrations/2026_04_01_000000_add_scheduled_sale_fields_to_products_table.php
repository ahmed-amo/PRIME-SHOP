<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // No ->after(): PostgreSQL ignores/fails it; column order does not matter.
            $table->boolean('sale_enabled')->default(false);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->timestamp('sale_starts_at')->nullable();
            $table->timestamp('sale_ends_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'sale_enabled',
                'sale_price',
                'sale_starts_at',
                'sale_ends_at',
            ]);
        });
    }
};

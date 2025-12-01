<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add phone (nullable, string)
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('password');
            }

            // Add picture (for profile image path/url, nullable)
            if (!Schema::hasColumn('users', 'picture')) {
                $table->string('picture')->nullable()->after('phone');
            }

            // Add address (text or long string, nullable)
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('picture');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'picture', 'address']);
        });
    }
};

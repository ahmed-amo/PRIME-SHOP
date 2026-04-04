<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_country_dial', 8)->nullable()->after('phone');
        });

        Schema::table('vendors', function (Blueprint $table) {
            $table->string('phone_country_dial', 8)->nullable()->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('phone_country_dial');
        });

        Schema::table('vendors', function (Blueprint $table) {
            $table->dropColumn('phone_country_dial');
        });
    }
};

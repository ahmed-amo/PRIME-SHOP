<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Denormalized public URLs for gallery images (R2/S3).
     * Kept in sync from Spatie media so Blade and APIs can read stable URLs after redeploy.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('gallery_urls')->nullable()->after('image');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('gallery_urls');
        });
    }
};

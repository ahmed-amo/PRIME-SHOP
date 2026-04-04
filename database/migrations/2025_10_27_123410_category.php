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
        Schema::create('categories', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('name'); // Category name
            $table->string('slug')->unique(); // Unique slug for URL-friendly identifier
            $table->text('description')->nullable(); // Description, nullable for optional
            $table->string('image')->nullable(); // Image path or URL, nullable for optional
            $table->string('color')->nullable(); // Color code (e.g., hex), nullable for optional
            $table->boolean('status')->default(true); // Status (e.g., active/inactive), default to true
            $table->timestamps(); // Created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};

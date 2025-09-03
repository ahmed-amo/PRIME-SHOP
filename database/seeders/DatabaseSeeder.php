<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $categories = [
            [
                'name' => "Beauty & Fragrance",
                'slug' => "beauty-fragrance",
                'image' => "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                'color' => "bg-amber-50",
            ],
            [
                'name' => "Health & Personal",
                'slug' => "health-personal",
                'image' => "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                'color' => "bg-sky-50",
            ],
            [
                'name' => "Men's Fashion",
                'slug' => "mens-fashion",
                'image' => "https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                'color' => "bg-blue-50",
            ]
        ];

        // Actually create the categories in the database
        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'color' => '#3b82f6', // blue-500
                'image' => 'electronics.jpg',
            ],
            [
                'name' => 'Clothing',
                'color' => '#f97316', // orange-500
                'image' => 'clothing.jpg',
            ],
            [
                'name' => 'Home & Kitchen',
                'color' => '#10b981', // green-500
                'image' => 'home.jpg',
            ],
            [
                'name' => 'Toys',
                'color' => '#eab308', // yellow-500
                'image' => 'toys.jpg',
            ],
            [
                'name' => 'Books',
                'color' => '#8b5cf6', // purple-500
                'image' => 'books.jpg',
            ],
        ];

        foreach ($categories as $cat) {
            Category::create([
                'name' => $cat['name'],
                'slug' => Str::slug($cat['name']),
                'color' => $cat['color'],
                'image' => $cat['image'],
                'products_number' => 0,
                'status' => true,
            ]);
        }
    }
}

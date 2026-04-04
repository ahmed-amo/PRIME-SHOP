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
                'name' => 'Accessories',
                'color' => '#3b82f6',
                'image' => 'catpics/Accesories.png',
            ],
            [
                'name' => 'Beauty',
                'color' => '#ec4899',
                'image' => 'catpics/Beauty.png',
            ],
            [
                'name' => 'Cars',
                'color' => '#6b7280',
                'image' => 'catpics/cars.png',
            ],
            [
                'name' => 'Clothes',
                'color' => '#f97316',
                'image' => 'catpics/clothes.png',
            ],
            [
                'name' => 'Electronics',
                'color' => '#10b981',
                'image' => 'catpics/electronics.png',
            ],
            [
                'name' => 'Gym',
                'color' => '#111827',
                'image' => 'catpics/gym.png',
            ],
            [
                'name' => 'Real Estate',
                'color' => '#8b5cf6',
                'image' => 'catpics/real-estate.png.jpg',
            ],
            [
                'name' => 'Tools',
                'color' => '#eab308',
                'image' => 'catpics/tools.png',
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'color' => $cat['color'],
                    'image' => $cat['image'],
                    'status' => true,
                ]
            );
        }
    }
}

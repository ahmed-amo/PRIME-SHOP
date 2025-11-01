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
                'image' => 'wireless-mouse.png',
            ],
            [
                'name' => 'Clothing',
                'color' => '#f97316', // orange-500
                'image' => 'mechanical-keyboard.png',
            ],
            [
                'name' => 'Home & Kitchen',
                'color' => '#10b981', // green-500
                'image' => 'laptop-stand.png',
            ],
            [
                'name' => 'Toys',
                'color' => '#eab308', // yellow-500
                'image' => 'classic-webcam.png',
            ],
            [
                'name' => 'Books',
                'color' => '#8b5cf6', // purple-500
                'image' => 'premium-headphones.png',
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

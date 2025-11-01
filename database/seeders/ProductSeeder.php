<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Map category slug => sample products
        $catalog = [
            'electronics' => [
                ['name' => 'Wireless Mouse', 'price' => 19.99, 'stock' => 120, 'sku' => 'ELEC-MOUSE-001'],
                ['name' => 'Mechanical Keyboard', 'price' => 79.99, 'stock' => 60, 'sku' => 'ELEC-KEYBD-001'],
                ['name' => 'HD Webcam', 'price' => 39.99, 'stock' => 85, 'sku' => 'ELEC-WEBCAM-001'],
            ],
            'clothing' => [
                ['name' => 'Classic T-Shirt', 'price' => 14.99, 'stock' => 200, 'sku' => 'CLOTH-TSHIRT-001'],
                ['name' => 'Jeans', 'price' => 49.99, 'stock' => 90, 'sku' => 'CLOTH-JEANS-001'],
            ],
            'home-kitchen' => [
                ['name' => 'Aluminum Laptop Stand', 'price' => 29.99, 'stock' => 75, 'sku' => 'HOME-LAPSTAND-001'],
                ['name' => 'Smart Kettle', 'price' => 59.99, 'stock' => 40, 'sku' => 'HOME-KETTLE-001'],
            ],
            'toys' => [
                ['name' => 'Building Blocks Set', 'price' => 24.99, 'stock' => 150, 'sku' => 'TOYS-BLOCKS-001'],
            ],
            'books' => [
                ['name' => 'Modern PHP Handbook', 'price' => 29.99, 'stock' => 35, 'sku' => 'BOOK-PHP-001'],
            ],
        ];

        foreach ($catalog as $categorySlug => $products) {
            $category = Category::where('slug', $categorySlug)->first();
            if (! $category) {
                // Try to resolve by name -> slug convention if seeders differ
                $alt = str_replace(' ', '-', strtolower($categorySlug));
                $category = Category::where('slug', $alt)->first();
            }
            if (! $category) {
                continue;
            }

            foreach ($products as $data) {
                Product::updateOrCreate(
                    [
                        'category_id' => $category->id,
                        'slug' => Str::slug($data['name']),
                    ],
                    [
                        'name' => $data['name'],
                        'description' => $data['name'].' description',
                        'price' => $data['price'],
                        'stock' => $data['stock'],
                        'sku' => $data['sku'],
                        'status' => true,
                    ]
                );
            }
        }
    }
}

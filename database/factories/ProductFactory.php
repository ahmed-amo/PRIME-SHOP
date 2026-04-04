<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'category_id' => Category::query()->inRandomOrder()->value('id') ?? Category::factory(),
            'name' => $name,
            'description' => fake()->paragraphs(2, true),
            'price' => fake()->randomFloat(2, 5, 999),
            'stock' => fake()->numberBetween(0, 500),
            'sku' => strtoupper(fake()->unique()->bothify('PRM-???-####')),
            'status' => true,
            'compare_at_price' => null,
            'sale_enabled' => false,
            'sale_price' => null,
            'sale_starts_at' => null,
            'sale_ends_at' => null,
            'image' => null,
        ];
    }
}

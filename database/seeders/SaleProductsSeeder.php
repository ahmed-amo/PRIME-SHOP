<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class SaleProductsSeeder extends Seeder
{
    /**
     * Scheduled sales (sale_enabled + sale_price) on five catalog SKUs.
     * List / regular price stays in `price`; customers pay `sale_price` during the window.
     *
     * @var array<string, array{sale_price: float}>
     */
    private const SALE_BY_SKU = [
        'PIC-BEA-001' => ['sale_price' => 3_900.0],
        'PIC-ACC-001' => ['sale_price' => 2_900.0],
        'PIC-ELC-001' => ['sale_price' => 8_900.0],
        'PIC-CLO-001' => ['sale_price' => 5_200.0],
        'PIC-TL-001' => ['sale_price' => 1_200.0],
    ];

    public function run(): void
    {
        foreach (self::SALE_BY_SKU as $sku => $cfg) {
            $product = Product::query()->where('sku', $sku)->first();

            if (! $product) {
                Log::warning('SaleProductsSeeder: product not found, skipping', ['sku' => $sku]);

                continue;
            }

            $listPrice = (float) $product->price;
            $salePrice = (float) $cfg['sale_price'];

            if ($salePrice >= $listPrice) {
                $salePrice = max(0.0, $listPrice - 500);
            }

            $product->fill([
                'compare_at_price' => null,
                'sale_enabled' => true,
                'sale_price' => $salePrice,
                'sale_starts_at' => now()->subDay(),
                'sale_ends_at' => now()->addMonths(6),
            ]);

            $product->save();
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $vendorIds = Vendor::query()->orderBy('id')->pluck('id')->values()->all();
        if (count($vendorIds) < 1) {
            Log::warning('ProductSeeder: no vendors found; run VendorsSeeder first.');

            return;
        }

        $catalog = $this->catalog();
        $skus = array_column($catalog, 'sku');
        Product::query()->whereIn('sku', $skus)->delete();

        foreach ($catalog as $index => $row) {
            $category = Category::query()->where('name', $row['category'])->first();
            if (! $category) {
                Log::warning('ProductSeeder: category not found, skipping', ['category' => $row['category'], 'sku' => $row['sku']]);

                continue;
            }

            $vendorId = $vendorIds[$index % count($vendorIds)];

            Product::query()->create([
                'vendor_id' => $vendorId,
                'category_id' => $category->id,
                'sku' => $row['sku'],
                'name' => $row['name'],
                'description' => $row['description'],
                'image' => $row['image'],
                'price' => (float) $row['price'],
                'stock' => $row['stock'],
                'status' => true,
                'compare_at_price' => null,
                'sale_enabled' => false,
                'sale_price' => null,
                'sale_starts_at' => null,
                'sale_ends_at' => null,
            ]);
        }
    }

    /**
     * @return list<array{sku: string, category: string, name: string, description: string, image: string, price: float|int, stock: int}>
     */
    protected function catalog(): array
    {
        return [
            [
                'sku' => 'PIC-BEA-001',
                'category' => 'Beauty',
                'name' => 'Radiance beauty serum set',
                'description' => "A two-step glow routine for morning and night: a lightweight hydrating serum plus a gentle finishing layer that suits normal to combination skin.\n\nUse after cleansing; pat dry, apply serum, then follow with your usual moisturizer or SPF during the day. Fragrance-aware formula; patch test if you have sensitive skin.",
                'image' => 'producss/beauty.jpg',
                'price' => 5_500,
                'stock' => 45,
            ],
            [
                'sku' => 'PIC-BEA-002',
                'category' => 'Beauty',
                'name' => 'Salon hair care shampoo',
                'description' => "Professional-style shampoo for everyday washing without stripping colour-treated hair.\n\nLathers richly, rinses clean, and leaves hair soft and manageable. Ideal for frequent use; pair with your favourite conditioner for longer styles.",
                'image' => 'producss/shampoo.jpg',
                'price' => 2_000,
                'stock' => 80,
            ],
            [
                'sku' => 'PIC-BEA-003',
                'category' => 'Beauty',
                'name' => 'Daily beauty essentials kit',
                'description' => "A compact kit of mini essentials for skincare touch-ups and travel.\n\nIncludes travel-friendly sizes you can slip into a bag or desk drawer. Great as a gift or to try new textures before buying full size.",
                'image' => 'producss/women things.jpg',
                'price' => 3_500,
                'stock' => 60,
            ],
            [
                'sku' => 'PIC-ACC-001',
                'category' => 'Accessories',
                'name' => 'Designer-style optical glasses',
                'description' => "Lightweight frames with clear demo lenses; swap for your prescription at any optician.\n\nNeutral silhouette that works for office or street style. Includes a soft pouch—treat hinges gently when folding.",
                'image' => 'producss/glasses.jpg',
                'price' => 4_200,
                'stock' => 35,
            ],
            [
                'sku' => 'PIC-ACC-002',
                'category' => 'Accessories',
                'name' => 'Everyday essentials bundle',
                'description' => "Mixed accessories you reach for daily: small goods bundled for value.\n\nContents may vary slightly by batch; everything is new and packed for retail. Perfect for restocking a drawer or starter kit.",
                'image' => 'producss/mix.jpg',
                'price' => 2_500,
                'stock' => 50,
            ],
            [
                'sku' => 'PIC-ELC-001',
                'category' => 'Electronics',
                'name' => 'Wireless over-ear headset',
                'description' => "Closed-back over-ear headphones with deep bass and cushioned ear cups for long sessions.\n\nPairs via Bluetooth; onboard controls for volume and track skip. Charge with USB-C; battery life varies with volume and codec.",
                'image' => 'producss/headset.jpg',
                'price' => 12_000,
                'stock' => 25,
            ],
            [
                'sku' => 'PIC-ELC-002',
                'category' => 'Electronics',
                'name' => 'RGB mechanical keyboard',
                'description' => "Tactile switches with per-key RGB lighting for gaming and typing.\n\nSolid aluminium top plate, detachable USB-C cable, and software-friendly layout. O-ring dampening recommended if you prefer a quieter office setup.",
                'image' => 'producss/keyboard.jpg',
                'price' => 9_500,
                'stock' => 40,
            ],
            [
                'sku' => 'PIC-ELC-003',
                'category' => 'Electronics',
                'name' => 'Ergonomic wireless mouse',
                'description' => "Comfortable right-hand sculpt with precise sensor and long battery life.\n\nConnects with the included USB receiver; works on most desks—use a pad for glass surfaces. DPI button cycles through preset sensitivities.",
                'image' => 'producss/mouse.jpg',
                'price' => 3_200,
                'stock' => 70,
            ],
            [
                'sku' => 'PIC-CLO-001',
                'category' => 'Clothes',
                'name' => 'Lightweight running shoes',
                'description' => "Breathable mesh upper with a cushioned midsole for daily miles and errands.\n\nTrue-to-size for most feet; wide feet may prefer half a size up. Wipe clean; air dry away from direct heat.",
                'image' => 'producss/shoes.jpg',
                'price' => 7_500,
                'stock' => 30,
            ],
            [
                'sku' => 'PIC-RES-001',
                'category' => 'Real Estate',
                'name' => 'Modern interior wall art print',
                'description' => "Large-format photographic print to elevate living rooms, bedrooms, or office walls.\n\nShipped rolled in a protective tube; frame is not included. Colours may vary slightly by monitor—matte paper reduces glare under lights.",
                'image' => 'producss/howard-bouchevereau-RSCirJ70NDM-unsplash.jpg',
                'price' => 15_000,
                'stock' => 12,
            ],
            [
                'sku' => 'PIC-TL-001',
                'category' => 'Tools',
                'name' => 'Compact zip tool pouch',
                'description' => "Rugged small pouch for bits, mini drivers, and everyday fixes.\n\nHeavy zipper and reinforced seams; loops for a belt or bag strap. Empty pouch—add your own tools.",
                'image' => 'producss/zit.jpg',
                'price' => 1_800,
                'stock' => 55,
            ],
        ];
    }
}

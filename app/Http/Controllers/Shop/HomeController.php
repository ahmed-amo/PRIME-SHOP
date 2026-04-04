<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Support\ShopHomeCache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $seconds = max(10, (int) config('cache.shop_home_seconds', 120));

        $payload = Cache::remember(ShopHomeCache::KEY, $seconds, function () {
            return $this->buildShopHomePayload();
        });

        return Inertia::render('home', $payload);
    }

    /**
     * Assemble props for the shop home page (cached as one blob for Redis/file/db stores).
     *
     * @return array{products: mixed, categories: mixed, salesProducts: mixed, heroSlides: mixed}
     */
    private function buildShopHomePayload(): array
    {
        $products = Product::with(['category', 'vendor'])
            ->withShopReviewStats()
            ->forPublicStorefront()
            ->where('status', true)
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn (Product $product) => $product->toShopFrontArray())
            ->values();

        $categories = Category::orderBy('name')
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'color' => $category->color,
                'image_url' => $category->image
                    ? (Str::startsWith($category->image, 'catpics/') ? asset($category->image) : asset('storage/'.$category->image))
                    : null,
            ]);

        $heroSlides = Product::with(['category', 'vendor'])
            ->withShopReviewStats()
            ->forPublicStorefront()
            ->where('status', true)
            ->whereNotNull('hero_sort_order')
            ->orderBy('hero_sort_order')
            ->orderBy('id')
            ->limit(12)
            ->get()
            ->values()
            ->map(fn (Product $product, int $index) => $product->toHeroSlideArray($index));

        $salesProducts = Product::with(['category', 'vendor'])
            ->withShopReviewStats()
            ->forPublicStorefront()
            ->where('status', true)
            ->where('stock', '>', 0)
            ->latest('updated_at')
            ->limit(100)
            ->get()
            ->filter(fn (Product $p) => $p->is_sale_active)
            ->take(12)
            ->values()
            ->map(function (Product $product) {
                $s = $product->toShopFrontArray();

                return [
                    'id' => $s['id'],
                    'name' => $s['name'],
                    'slug' => $s['slug'],
                    'description' => $s['description'],
                    'price' => $s['price'],
                    'originalPrice' => $s['original_display_price'] ?? $s['list_price'],
                    'discountPercentage' => $s['discount_percentage'],
                    'stock' => $s['stock'],
                    'category' => $s['category'],
                    'category_id' => $s['category_id'],
                    'rating' => $s['rating'],
                    'image_url' => $s['image_url'],
                ];
            });

        return [
            'products' => $products,
            'categories' => $categories,
            'salesProducts' => $salesProducts,
            'heroSlides' => $heroSlides,
        ];
    }

    /**
     * Shop catalog: all products with optional search (same listing UX as category page).
     */
    public function all_products(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $query = Product::query()
            ->with(['category', 'vendor'])
            ->withShopReviewStats()
            ->forPublicStorefront()
            ->where('status', true)
            ->latest();

        if ($q !== '') {
            $safe = addcslashes($q, '%_\\');
            $term = '%'.$safe.'%';
            $driver = $query->getConnection()->getDriverName();

            $query->where(function ($sub) use ($term, $driver) {
                if ($driver === 'pgsql') {
                    $sub->where('name', 'ilike', $term)
                        ->orWhere('description', 'ilike', $term);
                } else {
                    $sub->where('name', 'like', $term)
                        ->orWhere('description', 'like', $term);
                }
            });
        }

        $products = $query->paginate(12)->withQueryString();

        $products->getCollection()->transform(fn (Product $product) => $product->toShopFrontArray());

        return Inertia::render('ProductsCatalog', [
            'filters' => [
                'q' => $q,
            ],
            'products' => $products,
        ]);
    }

    public function get_category_products(Category $category)
    {
        $products = $category->products()
            ->forPublicStorefront()
            ->where('status', true)
            ->with(['category', 'vendor'])
            ->withShopReviewStats()
            ->latest()
            ->paginate(12);

        $products->getCollection()->transform(function (Product $product) {
            return $product->toShopFrontArray();
        });

        $imageUrl = null;
        if ($category->image) {
            $imageUrl = Str::startsWith($category->image, 'catpics/')
                ? asset($category->image)
                : asset('storage/'.$category->image);
        }

        return Inertia::render('CategoryDetail', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'color' => $category->color,
                'image' => $category->image,
                'image_url' => $imageUrl,
            ],
            'products' => $products,
        ]);
    }

    public function get_categories()
    {
        $categories = Category::orderBy('name')
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'color' => $category->color,
                'image_url' => $category->image
                    ? (Str::startsWith($category->image, 'catpics/') ? asset($category->image) : asset('storage/'.$category->image))
                    : null,
            ]);

        return Inertia::render('Categories', [
            'categories' => $categories,
        ]);
    }
}

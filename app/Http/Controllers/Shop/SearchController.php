<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SearchController extends Controller
{
    private const SUGGEST_PRODUCT_POOL = 48;

    private const SUGGEST_PRODUCT_TAKE = 10;

    private const SUGGEST_CATEGORY_POOL = 24;

    private const SUGGEST_CATEGORY_TAKE = 6;

    /** Max UTF-8 length for search input (DoS / query cost guard). */
    private const MAX_QUERY_LEN = 120;

    public function index(Request $request)
    {
        $raw = (string) $request->get('q', '');
        $query = mb_substr(trim($raw), 0, self::MAX_QUERY_LEN);

        if ($query === '' || mb_strlen($query) < 2) {
            return Inertia::render('Search', [
                'query' => $query,
                'products' => [],
                'categories' => [],
            ]);
        }

        $like = $this->likeContains(mb_strtolower($this->escapeLike($query)));

        $products = Product::query()
            ->with(['category', 'vendor'])
            ->withShopReviewStats()
            ->forPublicStorefront()
            ->where('status', true)
            ->where(function ($q) use ($like) {
                $q->whereRaw('LOWER(name) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(COALESCE(description, \'\')) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(COALESCE(sku, \'\')) LIKE ?', [$like]);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Product $product) => $product->toShopFrontArray());

        $categories = Category::query()
            ->where(function ($q) use ($like) {
                $q->whereRaw('LOWER(name) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(COALESCE(description, \'\')) LIKE ?', [$like]);
            })
            ->limit(50)
            ->get()
            ->sortByDesc(fn (Category $c) => $this->categorySearchScore($c, mb_strtolower($query)))
            ->take(24)
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'image_url' => $this->categoryImageUrl($category->image),
            ])
            ->values();

        return Inertia::render('Search', [
            'query' => $query,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function suggestions(Request $request)
    {
        $raw = (string) $request->get('q', '');
        $query = mb_substr(trim($raw), 0, self::MAX_QUERY_LEN);

        if ($query === '' || mb_strlen($query) < 2) {
            return response()->json([
                'products' => [],
                'categories' => [],
            ]);
        }

        $needle = mb_strtolower($query);
        $like = $this->likeContains(mb_strtolower($this->escapeLike($query)));

        $productRows = Product::query()
            ->forPublicStorefront()
            ->where('status', true)
            ->where(function ($q) use ($like) {
                $q->whereRaw('LOWER(name) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(COALESCE(description, \'\')) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(COALESCE(sku, \'\')) LIKE ?', [$like]);
            })
            ->select(['id', 'name', 'slug', 'price', 'sale_enabled', 'sale_price', 'sale_starts_at', 'sale_ends_at', 'compare_at_price', 'image', 'description', 'sku'])
            ->limit(self::SUGGEST_PRODUCT_POOL)
            ->get()
            ->sortByDesc(fn (Product $p) => $this->productSuggestionScore($p, $needle))
            ->take(self::SUGGEST_PRODUCT_TAKE)
            ->map(fn (Product $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'price' => (float) $p->active_price,
                'image_url' => $p->galleryImageUrl(),
                'type' => 'product',
            ])
            ->values();

        $categoryRows = Category::query()
            ->where(function ($q) use ($like) {
                $q->whereRaw('LOWER(name) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(COALESCE(description, \'\')) LIKE ?', [$like]);
            })
            ->select(['id', 'name', 'slug', 'image', 'description'])
            ->limit(self::SUGGEST_CATEGORY_POOL)
            ->get()
            ->sortByDesc(fn (Category $c) => $this->categorySearchScore($c, $needle))
            ->take(self::SUGGEST_CATEGORY_TAKE)
            ->map(fn (Category $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'image_url' => $this->categoryImageUrl($c->image),
                'type' => 'category',
            ])
            ->values();

        return response()->json([
            'products' => $productRows,
            'categories' => $categoryRows,
        ]);
    }

    /**
     * Escape LIKE wildcards so user input cannot broaden matches.
     */
    private function escapeLike(string $value): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $value);
    }

    private function likeContains(string $lowerEscapedFragment): string
    {
        return '%'.$lowerEscapedFragment.'%';
    }

    private function categoryImageUrl(?string $image): ?string
    {
        if (! $image) {
            return null;
        }

        if (Str::startsWith($image, ['http://', 'https://'])) {
            return $image;
        }

        if (Str::startsWith($image, ['catpics/', 'producss/'])) {
            return asset($image);
        }

        return asset('storage/'.$image);
    }

    private function productSuggestionScore(Product $p, string $needle): int
    {
        $name = mb_strtolower((string) $p->name);
        $sku = mb_strtolower((string) ($p->sku ?? ''));
        $desc = mb_strtolower((string) ($p->description ?? ''));

        if ($name === $needle) {
            return 10_000;
        }
        if (str_starts_with($name, $needle)) {
            return 8_000 - min(mb_strlen($name), 500);
        }
        $pos = mb_strpos($name, $needle);
        if ($pos !== false) {
            return 6_000 - $pos;
        }
        if ($sku !== '' && str_contains($sku, $needle)) {
            return 4_000;
        }
        if ($desc !== '' && str_contains($desc, $needle)) {
            return 2_000;
        }

        return 0;
    }

    private function categorySearchScore(Category $c, string $needle): int
    {
        $name = mb_strtolower((string) $c->name);
        $desc = mb_strtolower((string) ($c->description ?? ''));

        if ($name === $needle) {
            return 10_000;
        }
        if (str_starts_with($name, $needle)) {
            return 8_000 - min(mb_strlen($name), 500);
        }
        $pos = mb_strpos($name, $needle);
        if ($pos !== false) {
            return 6_000 - $pos;
        }
        if ($desc !== '' && str_contains($desc, $needle)) {
            return 2_000;
        }

        return 0;
    }
}

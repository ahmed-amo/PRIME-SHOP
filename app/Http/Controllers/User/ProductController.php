<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Product::class);

        $products = Product::with('category')
            ->with('media')
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => (float) $product->price,
                'compare_at_price' => $product->compare_at_price !== null ? (float) $product->compare_at_price : null,
                'is_on_sale' => $product->isOnSale(),
                'stock' => (int) $product->stock,
                'sku' => $product->sku,
                'status' => $this->getStockStatus($product->stock),
                'category' => $product->category ? $product->category->name : null,
                'category_id' => $product->category_id,
                'image_url' => $product->galleryImageUrl(),
                'images' => $product->galleryImageUrls(5),
            ]);

        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Dashboard/Admin/ProductsDash', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Product::class);

        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Dashboard/Admin/AddProduct', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $this->authorize('create', Product::class);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', config('filesystems.default'));
            $data['image'] = $path;
        }

        $galleryFiles = $request->file('gallery_images', []);
        unset($data['gallery_images'], $data['replace_gallery']);

        $product = Product::create($data);

        if (is_array($galleryFiles) && count($galleryFiles) > 0) {
            foreach (array_slice($galleryFiles, 0, 5) as $file) {
                $product->addMedia($file)->toMediaCollection('gallery');
            }
        }

        return redirect()->route('admin.products')
            ->with('success', 'Product created successfully')
            ->with('preserveScroll', true);
    }

    public function edit(Product $product): Response
    {
        $this->authorize('update', $product);

        $product->load('media');
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Dashboard/Admin/EditProduct', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => (float) $product->price,
                'compare_at_price' => $product->compare_at_price !== null ? (float) $product->compare_at_price : null,
                'sale_enabled' => (bool) $product->sale_enabled,
                'sale_price' => $product->sale_price !== null ? (float) $product->sale_price : null,
                'sale_starts_at' => $product->sale_starts_at?->format('Y-m-d\TH:i'),
                'sale_ends_at' => $product->sale_ends_at?->format('Y-m-d\TH:i'),
                'stock' => (int) $product->stock,
                'sku' => $product->sku,
                'status' => $product->status,
                'category_id' => $product->category_id,
                'image_url' => $product->galleryImageUrl(),
                'gallery_images' => $product->galleryImageUrls(5),
                'hero_sort_order' => $product->hero_sort_order,
            ],
            'categories' => $categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        $data = $request->validated();

        if (! ($data['sale_enabled'] ?? false)) {
            $data['sale_price'] = null;
            $data['sale_starts_at'] = null;
            $data['sale_ends_at'] = null;
        }

        if ($request->hasFile('image')) {
            $this->deleteUploadableProductImage($product->image);
            $path = $request->file('image')->store('products', config('filesystems.default'));
            $data['image'] = $path;
        }

        $galleryFiles = $request->file('gallery_images', []);
        $replace = (bool) ($data['replace_gallery'] ?? false);
        unset($data['gallery_images'], $data['replace_gallery']);

        $product->update($data);

        if (is_array($galleryFiles) && count($galleryFiles) > 0) {
            if ($replace) {
                $product->clearMediaCollection('gallery');
            }
            foreach (array_slice($galleryFiles, 0, 5) as $file) {
                $product->addMedia($file)->toMediaCollection('gallery');
            }
        }

        return redirect()->route('admin.products')
            ->with('success', 'Product created successfully')
            ->with('preserveScroll', true);
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $this->deleteUploadableProductImage($product->image);

        $product->delete();

        return back()->with('success', 'Product deleted successfully');
    }

    private function getStockStatus(int $stock): string
    {
        if ($stock === 0) {
            return 'out of stock';
        } elseif ($stock < 20) {
            return 'low stock';
        }

        return 'active';
    }

    /** Only remove files on the public disk; skip bundled public/ paths (producss/, catpics/). */
    private function deleteUploadableProductImage(?string $path): void
    {
        if ($path === null || $path === '') {
            return;
        }
        if (Str::startsWith($path, ['catpics/', 'producss/'])) {
            return;
        }
        if (Str::startsWith($path, ['http://', 'https://'])) {
            return;
        }
        Storage::disk(config('filesystems.default'))->delete($path);
    }

    // app/Http/Controllers/ProductController.php
    public function get_product_detail(Product $product)
    {
        $product->load(['category', 'vendor', 'media']);

        if ($product->vendor && $product->vendor->status !== 'active') {
            abort(404);
        }

        $product->load([
            'reviews' => fn ($q) => $q->with('user:id,name,picture,avatar')->latest(),
        ]);
        $product->loadAvg('reviews', 'rating');
        $product->loadCount('reviews');

        $category = $product->category;

        $authUser = auth()->user();
        $userReview = null;
        $canReview = false;
        if ($authUser) {
            $userReview = ProductReview::where('user_id', $authUser->id)
                ->where('product_id', $product->id)
                ->first();
            if (! $userReview) {
                $canReview = Order::where('user_id', $authUser->id)
                    ->where('status', 'delivered')
                    ->whereHas('items', fn ($q) => $q->where('product_id', $product->id))
                    ->exists();
            }
        }

        $reviewsList = $product->reviews->map(fn ($r) => [
            'id' => $r->id,
            'rating' => $r->rating,
            'body' => $r->body,
            'created_at' => $r->created_at?->toIso8601String(),
            'user' => [
                'name' => $r->user->name,
                'avatar_url' => $r->user->avatarDisplayUrl(),
            ],
        ])->values()->all();

        $productPayload = array_merge($product->toShopFrontArray(), [
            'reviews_list' => $reviewsList,
            'can_review' => $canReview && ! $userReview,
            'user_review' => $userReview ? [
                'id' => $userReview->id,
                'rating' => $userReview->rating,
                'body' => $userReview->body,
            ] : null,
        ]);

        $saleProducts = Product::query()
            ->with(['category', 'vendor', 'media'])
            ->withShopReviewStats()
            ->forPublicStorefront()
            ->where('status', true)
            ->where('stock', '>', 0)
            ->whereKeyNot($product->id)
            ->latest('updated_at')
            ->limit(80)
            ->get()
            ->filter(fn (Product $p) => $p->is_sale_active)
            ->take(12)
            ->values()
            ->map(function (Product $p) {
                $s = $p->toShopFrontArray();

                return [
                    'id' => $s['id'],
                    'name' => $s['name'],
                    'slug' => $s['slug'],
                    'description' => $s['description'] ?? '',
                    'price' => $s['price'],
                    'originalPrice' => (float) ($s['original_display_price'] ?? $s['list_price'] ?? $s['price']),
                    'discountPercentage' => $s['discount_percentage'],
                    'stock' => $s['stock'],
                    'category' => $s['category'],
                    'category_id' => $s['category_id'],
                    'rating' => $s['rating'],
                    'image_url' => $s['image_url'],
                ];
            });

        return Inertia::render('ProductDetail', [
            'product' => $productPayload,
            'category' => $category ? [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ] : null,
            'saleProducts' => $saleProducts,
        ]);
    }
}

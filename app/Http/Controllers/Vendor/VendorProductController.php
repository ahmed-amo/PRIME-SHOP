<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreVendorProductRequest;
use App\Http\Requests\Vendor\UpdateVendorProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VendorProductController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Product::class);

        $vendor = $request->user()->vendor;
        abort_unless($vendor, 403);

        $products = Product::query()
            ->with(['category', 'media'])
            ->where('vendor_id', $vendor->id)
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category' => $product->category?->name,
                'price' => (float) $product->price,
                'stock' => (int) $product->stock,
                'status' => $product->status ? 'Listed' : 'Hidden',
                'listed' => (bool) $product->status,
                'image_url' => $product->galleryImageUrl(),
                'images' => $product->galleryImageUrls(5),
            ]);

        return Inertia::render('Vendor/Products/Index', [
            'products' => $products,
            'success' => $request->session()->get('success'),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Product::class);

        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Vendor/Products/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreVendorProductRequest $request): RedirectResponse
    {
        $this->authorize('create', Product::class);

        $vendor = $request->user()->vendor;
        abort_unless($vendor, 403);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', config('filesystems.default'));
        }

        $data['vendor_id'] = $vendor->id;
        if (! array_key_exists('status', $data)) {
            $data['status'] = true;
        }

        $galleryFiles = $request->file('gallery_images', []);
        unset($data['gallery_images'], $data['replace_gallery']);

        $product = Product::create($data);

        if (is_array($galleryFiles) && count($galleryFiles) > 0) {
            foreach (array_slice($galleryFiles, 0, 5) as $file) {
                $product->addMedia($file)->toMediaCollection('gallery');
            }
        }

        return redirect()->route('vendor.products')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Request $request, Product $product): Response
    {
        $this->authorize('update', $product);

        $product->load('media');
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Vendor/Products/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price,
                'stock' => (int) $product->stock,
                'category_id' => $product->category_id,
                'status' => (bool) $product->status,
                'image_url' => $product->galleryImageUrl(),
                'gallery_images' => $product->galleryImageUrls(5),
            ],
            'categories' => $categories,
        ]);
    }

    public function update(UpdateVendorProductRequest $request, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $this->deleteUploadableProductImage($product->image);
            $data['image'] = $request->file('image')->store('products', config('filesystems.default'));
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

        return redirect()->route('vendor.products')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $this->deleteUploadableProductImage($product->image);
        $product->delete();

        return redirect()->route('vendor.products')
            ->with('success', 'Product deleted.');
    }

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
}

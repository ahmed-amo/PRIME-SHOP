<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::with('category')
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => (float) $product->price,
                'stock' => (int) $product->stock,
                'sku' => $product->sku,
                'status' => $this->getStockStatus($product->stock),
                'category' => $product->category ? $product->category->name : null,
                'category_id' => $product->category_id,
                'image_url' => $product->image ? Storage::url($product->image) : null,
            ]);

        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Dashboard/Admin/ProductsDash', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Dashboard/Admin/AddProduct', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
        }

        Product::create($data);

        return redirect()->route('admin.products')
        ->with('success', 'Product created successfully')
        ->with('preserveScroll', true);
    }

    public function edit(Product $product): Response
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Dashboard/Admin/EditProduct', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => (float) $product->price,
                'stock' => (int) $product->stock,
                'sku' => $product->sku,
                'status' => $product->status,
                'category_id' => $product->category_id,
                'image_url' => $product->image ? Storage::url($product->image) : null,
            ],
            'categories' => $categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if (!empty($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
        }

        $product->update($data);

        return redirect()->route('admin.products')
        ->with('success', 'Product created successfully')
        ->with('preserveScroll', true);
    }

    public function destroy(Product $product): RedirectResponse
    {
        if (!empty($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

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
}

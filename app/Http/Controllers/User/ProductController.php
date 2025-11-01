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
        $products = Product::with('category')->latest()->paginate(10)->withQueryString();
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
            $data['image'] = $path; // store relative path only
        }

        Product::create($data);

        return redirect()->route('products')->with('success', 'Product created');
    }

    public function edit(Product $product): Response
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Dashboard/Admin/EditProduct', [
            'product' => $product->only(['id','name','slug','description','price','stock','sku','status','category_id','image']),
            'categories' => $categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            // delete old if exists
            if (!empty($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
        }

        $product->update($data);

        return redirect()->route('products')->with('success', 'Product updated');
    }

    public function destroy(Product $product): RedirectResponse
    {
        if (!empty($product->image)) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();

        return back()->with('success', 'Product deleted');
    }
}

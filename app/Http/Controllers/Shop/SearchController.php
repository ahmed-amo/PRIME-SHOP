<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->get('q', '');

        if (!$query || strlen(trim($query)) < 2) {
            return Inertia::render('Search', [
                'query'      => $query,
                'products'   => [],
                'categories' => [],
            ]);
        }

        $products = Product::with('category')
            ->where('status', true)
            ->where(function ($q) use ($query) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$query}%"])
                ->orWhereRaw('LOWER(description) LIKE ?', ["%{$query}%"]);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn ($product) => [
                'id'          => $product->id,
                'name'        => $product->name,
                'slug'        => $product->slug,
                'description' => $product->description,
                'price'       => (float) $product->price,
                'stock'       => (int) $product->stock,
                'in_stock'    => $product->stock > 0,
                'category'    => $product->category?->name,
                'rating'      => 4.5,
                'image_url'   => $product->image ? asset('storage/' . $product->image) : null,
            ]);

        $categories = Category::where('name', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->get()
            ->map(fn ($category) => [
                'id'          => $category->id,
                'name'        => $category->name,
                'slug'        => $category->slug,
                'description' => $category->description,
                'image_url'   => $category->image ? asset('storage/' . $category->image) : null,
            ]);

        return Inertia::render('Search', [
            'query'      => $query,
            'products'   => $products,
            'categories' => $categories,
        ]);
    }
    public function suggestions(Request $request)
{
    $query = $request->get('q', '');

    if (!$query || strlen(trim($query)) < 2) {
        return response()->json([
            'products'   => [],
            'categories' => [],
        ]);
    }

    $products = Product::where('status', true)
        ->where('name', 'LIKE', "{$query}%")
        ->select('id', 'name', 'slug', 'price', 'image')
        ->limit(5)
        ->get()
        ->map(fn ($p) => [
            'id'        => $p->id,
            'name'      => $p->name,
            'slug'      => $p->slug,
            'price'     => (float) $p->price,
            'image_url' => $p->image ? asset('storage/' . $p->image) : null,
            'type'      => 'product',
        ]);

    $categories = Category::where('name', 'LIKE', "{$query}%")
        ->select('id', 'name', 'slug', 'image')
        ->limit(3)
        ->get()
        ->map(fn ($c) => [
            'id'        => $c->id,
            'name'      => $c->name,
            'slug'      => $c->slug,
            'image_url' => $c->image ? asset('storage/' . $c->image) : null,
            'type'      => 'category',
        ]);

    return response()->json([
        'products'   => $products,
        'categories' => $categories,
    ]);
}
}

<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index()
    {
        $products = Product::with('category')
            ->where('status', true)
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => (float) $product->price,
                'stock' => (int) $product->stock,
                'category' => $product->category ? $product->category->name : null,
                'category_id' => $product->category_id,
                'rating' => 4.5,
                'image_url' => $product->image ? asset('storage/' . $product->image) : null,
            ]);

        $categories = Category::orderBy('name')
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'color' => $category->color,
                'image_url' => $category->image ? asset('storage/' . $category->image) : null,
            ]);

        return Inertia::render('home', [
            'products' => $products,
            'categories' => $categories,

        ]);
    }


    public function get_category_products(Category $category)
    {
        $products = $category->products()
        ->where('status', true)
        ->with(['category'])
        ->latest()
        ->paginate(12);

    $products->getCollection()->transform(function ($product) {
        if ($product->image) {
            $product->image_url = asset('storage/' . $product->image);
        }
        $product->in_stock = $product->stock > 0;
        return $product;
    });

    return Inertia::render('CategoryDetail', [
        'category' => [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'color' => $category->color,
            'image' => $category->image,
            'image_url' => $category->image ? asset('storage/' . $category->image) : null,
        ],
        'products' => $products,
    ]);
}
}

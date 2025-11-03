<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
      public function get_home_data(): Response
{
    $categories = Category::where('status', true)
        ->withCount('products')
        ->latest()
        ->get()
        ->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'color' => $category->color ?? 'bg-amber-50',
                'image' => $category->image,
                'products_count' => $category->products_count ?? 0,
                'status' => $category->status,
            ];
        });
    return Inertia::render('home', [
        'categories' => $categories
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

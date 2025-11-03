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
// Add this method to your HomeController
public function get_category_products(Category $category)
{
    // Get products for this category with pagination
    $products = $category->products()
        ->where('status', true) // Only active products
        ->with(['category']) // Load category relationship
        ->latest()
        ->paginate(12);

    // Transform products to include image URLs
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

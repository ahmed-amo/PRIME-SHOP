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
}

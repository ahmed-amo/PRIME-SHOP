<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class CategoriesController extends Controller
{
    public function show_categories(): Response
    {
        $categories = Category::where('status', true)
            ->latest()
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'image' => $category->image,
                    'color' => $category->color,
                ];
            });

        return Inertia::render('Home', [
            'categories' => $categories
        ]);
    }
}

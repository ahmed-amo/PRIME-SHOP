<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
      public function index(): Response
    {
        $categories = Category::all();

        return Inertia::render('Home', [  // ← Changed from 'Categories/Index' to 'Home'
            'categories' => $categories
        ]);
    }

    // CATEGORIES PAGE - Separate page for all categories
    public function show_categories(): Response
    {
        $categories = Category::all();

        return Inertia::render('Categories/Index', [
            'categories' => $categories
        ]);
}
}

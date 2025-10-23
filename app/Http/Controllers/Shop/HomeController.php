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
        $categories = Category::where('status', true)
            ->latest()
            ->get();

        return Inertia::render('Home', [
            'categories' => $categories
        ]);
    }
}

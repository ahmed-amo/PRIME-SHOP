<?php

namespace App\Http\Controllers\Shop;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function get_home_data(){
        $categories =Category::latest() ->get();
        return Inertia::render('home',[
            'categories' => $categories
        ]);
    }
}

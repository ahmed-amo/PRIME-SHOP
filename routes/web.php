<?php

use Illuminate\Support\Facades\Route;
use App\Models\Category;
use Inertia\Inertia;
use App\Http\Controllers\Shop\CategoriesController;

Route::get('/test-categories', function() {
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

    return response()->json($categories);
});
//PUBLIC ROUTES//
Route::get('/testcate', [CategoriesController::class, 'show_categories']);



Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/product', function() {
    return Inertia::render('ProductDetail');
}) ->name('product');

//PROTECTED ROUTES

Route::middleware('auth')->group(function () {

    //CLIENT ROUTES

    Route::get('/home', function () {
    return Inertia::render('Home');
    })->name('ClientHome');
    Route::prefix('client')->group(function () {
     Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Client/Dashpage');
    })->name('client-dashboard');
    Route::get('/orders', function () {
    return Inertia::render('Dashboard/Client/Orders');
    })->name('client-orders');
    Route::get('/profile', function () {
    return Inertia::render('Dashboard/Client/Profile');
    })->name('client-profile');
    Route::get('/wishlist', function () {
    return Inertia::render('Dashboard/Client/WishList');
    })->name('client-wishlist');
});




    //ADMIN ROUTES
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', function() {
    return Inertia::render('Dashboard/Admin/Stats');
}) ->name('dashboard');
Route::get('/products', function() {
    return Inertia::render('Dashboard/Admin/ProductsDash');
}) ->name('products');
Route::get('/products/add', function() {
    return Inertia::render('Dashboard/Admin/AddProduct');
}) ->name('productsADD');
Route::get('/products/edit', function() {
    return Inertia::render('Dashboard/Admin/EditProduct');
}) ->name('productsEDIT');
Route::get('/categories', function() {
    return Inertia::render('Dashboard/Admin/CategoriesDash');
}) ->name('categories');
Route::get('/categories/add', function() {
    return Inertia::render('Dashboard/Admin/AddCategorie');
}) ->name('categoriesADD');
Route::get('/orders', function() {
    return Inertia::render('Dashboard/Admin/ClientOrders');
}) ->name('orders');
Route::get('/customers', function() {
    return Inertia::render('Dashboard/Admin/Customers');
}) ->name('customers');


});



});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

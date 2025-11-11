<?php

use Illuminate\Support\Facades\Route;
use App\Models\Category;
use Inertia\Inertia;
use App\Http\Controllers\Shop\HomeController;
use App\Http\Controllers\User\CategoryController;
use App\Http\Controllers\User\ProductController;


//PUBLIC ROUTES
Route::get('/', [HomeController::class, 'get_home_data'])
    ->name('home');

Route::get('/categories', function() {
    return Inertia::render('Categories');
})->name('shop.categories');

Route::get('/product', function() {
    return Inertia::render('ProductDetail');
})->name('product');

Route::get('/category/{category:slug}', [HomeController::class, 'get_category_products'])
    ->name('category.show');


//PROTECTED ROUTES
Route::middleware('auth')->group(function () {

    //CLIENT ROUTES
    Route::get('/home', [HomeController::class, 'get_home_data'])
        ->name('ClientHome');

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

        // Products CRUD
        Route::get('/products', [ProductController::class, 'index'])
            ->name('admin.products');

        Route::get('/products/add', [ProductController::class, 'create'])
            ->name('admin.products.create');

        Route::post('/products', [ProductController::class, 'store'])
            ->name('admin.products.store');

        Route::get('/products/{product}/edit', [ProductController::class, 'edit'])
            ->name('admin.products.edit');

        Route::put('/products/{product}', [ProductController::class, 'update'])
            ->name('admin.products.update');

        Route::delete('/products/{product}', [ProductController::class, 'destroy'])
            ->name('admin.products.destroy');

        //Categories CRUD
        Route::get('/categories', [CategoryController::class, 'index'])
            ->name('admin.categories');

        Route::get('/categories/add', [CategoryController::class, 'create'])
            ->name('admin.categories.create');

        Route::post('/categories/add', [CategoryController::class, 'store'])
            ->name('admin.categories.store');

        Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])
            ->name('admin.categories.edit');

        Route::put('/categories/{category}', [CategoryController::class, 'update'])
            ->name('admin.categories.update');

        Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])
            ->name('admin.categories.destroy');

        Route::get('/orders', function() {
            return Inertia::render('Dashboard/Admin/ClientOrders');
        })->name('admin.orders');

        Route::get('/customers', function() {
            return Inertia::render('Dashboard/Admin/Customers');
        })->name('admin.customers');

        Route::get('/dashboard', function() {
            return Inertia::render('Dashboard/Admin/Stats');
        })->name('admin.dashboard');
    });
});


require __DIR__.'/auth.php';
require __DIR__.'/settings.php';

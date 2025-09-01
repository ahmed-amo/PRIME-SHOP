<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/product', function() {
    return Inertia::render('ProductDetail');
}) ->name('product');



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard/index');
    })->name('dashboard');
    Route::get('/products', function () {
        return Inertia::render('dashboard/products');
    })->name('dashboard');
    Route::get('/categories', function () {
        return Inertia::render('dashboard/categories');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

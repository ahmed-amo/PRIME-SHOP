<?php


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'categories' => []
    ]);
})->name('home');

Route::get('/home', function () {
    return Inertia::render('Home', [
        'categories' => []
    ]);
})->name('ClientHome');


Route::get('/product', function() {
    return Inertia::render('ProductDetail');
}) ->name('product');

Route::get('/admin/dashboard', function() {
    return Inertia::render('Dashboard/Admin/Stats');
}) ->name('dashboard');



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

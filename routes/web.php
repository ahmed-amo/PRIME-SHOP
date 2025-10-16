<?php


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


//PUBLIC ROUTES//

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

    //ADMIN ROUTES
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/admin/dashboard', function() {
    return Inertia::render('Dashboard/Admin/Stats');
}) ->name('dashboard');
});



});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

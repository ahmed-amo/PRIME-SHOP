<?php

use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\SalesController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\RequiredPhoneController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\ProductGalleryBladeController;
use App\Http\Controllers\Shop\HomeController;
use App\Http\Controllers\Shop\ProductReviewController;
use App\Http\Controllers\Shop\SearchController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\User\CategoryController;
use App\Http\Controllers\User\ClientDashboardController;
use App\Http\Controllers\User\OrderController;
use App\Http\Controllers\User\ProductController;
use App\Http\Controllers\Vendor\VendorDashboardController;
use App\Http\Controllers\Vendor\VendorOrderController;
use App\Http\Controllers\Vendor\VendorProductController;
use App\Http\Controllers\Vendor\VendorSalesController;
use App\Http\Controllers\SuperAdmin\SuperAdminCategoryController;
use App\Http\Controllers\SuperAdmin\SuperAdminDashboardController;
use App\Http\Controllers\SuperAdmin\SuperAdminOrderController;
use App\Http\Controllers\SuperAdmin\SuperAdminUserController;
use App\Http\Controllers\SuperAdmin\SuperAdminVendorController;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// DEBUG ROUTE
Route::get('/debug-app-name', function () {
    return response()->json([
        'APP_NAME_env' => env('APP_NAME'),
        'config_app_name' => config('app.name'),
    ]);
});

// PUBLIC ROUTES
Route::get('/', [HomeController::class, 'index'])
    ->name('home');

Route::get('/shop', [HomeController::class, 'index'])
    ->name('shop');

Route::middleware(['auth', 'spatie_role:super_admin'])->prefix('super-admin')->name('super_admin.')->group(function () {
    Route::get('/dashboard', [SuperAdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/categories', [SuperAdminCategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [SuperAdminCategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [SuperAdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [SuperAdminCategoryController::class, 'destroy'])->name('categories.destroy');
    Route::get('/vendors', [SuperAdminVendorController::class, 'index'])->name('vendors.index');
    Route::patch('/vendors/{vendor}/status', [SuperAdminVendorController::class, 'updateStatus'])->name('vendors.updateStatus');
    Route::get('/orders', [SuperAdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/users', [SuperAdminUserController::class, 'index'])->name('users.index');
});

Route::middleware(['auth', 'spatie_role:vendor_admin|vendor_staff'])->prefix('vendor')->group(function () {
    Route::get('/pending-review', fn () => Inertia::render('Vendor/PendingReview'))->name('vendor.pending');
    Route::get('/account-suspended', fn () => Inertia::render('Vendor/AccountSuspended'))->name('vendor.suspended');
});

Route::middleware(['auth', 'spatie_role:vendor_admin|vendor_staff', 'vendor_active'])->prefix('vendor')->group(function () {
    Route::get('/dashboard', [VendorDashboardController::class, 'index'])->name('vendor.dashboard');
    Route::get('/products/create', [VendorProductController::class, 'create'])->name('vendor.products.create');
    Route::post('/products', [VendorProductController::class, 'store'])->name('vendor.products.store');
    Route::get('/products/{product}/edit', [VendorProductController::class, 'edit'])->name('vendor.products.edit');
    Route::put('/products/{product}', [VendorProductController::class, 'update'])->name('vendor.products.update');
    Route::delete('/products/{product}', [VendorProductController::class, 'destroy'])->name('vendor.products.destroy');
    Route::get('/products', [VendorProductController::class, 'index'])->name('vendor.products');
    Route::get('/orders/{vendor_order}', [VendorOrderController::class, 'show'])->name('vendor.orders.show');
    Route::patch('/orders/{vendor_order}', [VendorOrderController::class, 'update'])->name('vendor.orders.update');
    Route::get('/orders', [VendorOrderController::class, 'index'])->name('vendor.orders');
    Route::get('/sales', [VendorSalesController::class, 'index'])->name('vendor.sales');
    Route::patch('/sales/{product}', [VendorSalesController::class, 'update'])->name('vendor.sales.update');
    Route::get('/settings', fn () => Inertia::render('Vendor/Settings'))->name('vendor.settings');
});

Route::get('/categories', [HomeController::class, 'get_categories'])
    ->name('categories');

Route::get('/products', [HomeController::class, 'all_products'])
    ->name('shop.products');

Route::get('/search', [SearchController::class, 'index'])->name('search');

Route::get('/product/{product:slug}', [ProductController::class, 'get_product_detail'])
    ->name('product_detail');

/** Optional Blade demo: R2 gallery URLs (remove route if unused). */
Route::get('/product/{product:slug}/gallery-blade', [ProductGalleryBladeController::class, 'show'])
    ->name('product.gallery.blade');

Route::post('/product/{product:slug}/reviews', [ProductReviewController::class, 'store'])
    ->middleware('auth')
    ->name('shop.reviews.store');

Route::get('/product', function () {
    return Inertia::render('ProductDetail');
})->name('product');

Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);
Route::get('/category/{category:slug}', [HomeController::class, 'get_category_products'])
    ->name('category.show');

// Checkout & order success (allow guests)
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/orders/success/{orderNumber}', [CheckoutController::class, 'success'])->name('orders.success');

// Google OAuth callback view (Inertia page)
Route::get('/auth/callback', function () {
    return Inertia::render('AuthCallback');
})->name('auth.callback');

// Google OAuth callback endpoint (for Socialite)
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])
    ->name('auth.google.callback.web');

Route::post('/locale/{locale}', function (string $locale) {
    if (! in_array($locale, ['en', 'ar'], true)) {
        abort(404);
    }

    session(['locale' => $locale]);

    return back();
})->name('locale.switch');

// PROTECTED ROUTES
Route::middleware('auth')->group(function () {
    Route::post('/account/phone-required', [RequiredPhoneController::class, 'store'])->name('account.phone-required');

    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::redirect('/settings', '/settings/profile');
    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('/settings/password', [PasswordController::class, 'update'])->name('password.update');

    // CLIENT ROUTES
    Route::get('/home', [HomeController::class, 'index'])
        ->name('ClientHome');

    Route::prefix('client')->group(function () {
        Route::get('/dashboard', ClientDashboardController::class)->name('client-dashboard');

        Route::get('/profile', function (Request $request) {
            $user = $request->user();

            return Inertia::render('Dashboard/Client/Profile', [
                'user' => $user ? $user->only(['id', 'name', 'email', 'phone', 'address', 'picture', 'avatar']) : null,
                'mustVerifyEmail' => $user instanceof MustVerifyEmail,
                'status' => $request->session()->get('status'),
            ]);
        })->name('client.profile');

        Route::patch('/profile', [ProfileController::class, 'update'])->name('client.profile.update');
        Route::post('/profile/picture', [ProfileController::class, 'picture'])->name('client.profile.picture');

        Route::get('/wishlist', function () {
            return Inertia::render('Dashboard/Client/WishList');
        })->name('client-wishlist');

        // Order Routes
        Route::get('/my-orders', [OrderController::class, 'myOrders'])->name('orders.index');
    });

    // ADMIN ROUTES
    Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
        Route::post('/notifications/read-all', function () {
            $user = request()->user();
            if ($user) {
                $user->unreadNotifications->markAsRead();
            }

            return back();
        })->name('admin.notifications.readAll');

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

        // Categories CRUD
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

        Route::get('/customer-orders', [AdminOrderController::class, 'index'])
            ->name('admin.orders');

        Route::put('/customer-orders/{order}/confirm', [AdminOrderController::class, 'confirm'])
            ->name('admin.orders.confirm');

        Route::get('/customers', [CustomerController::class, 'index'])->name('admin.customers');
        Route::get('/customers/{user}', [CustomerController::class, 'show'])->name('admin.customer.detail');
        Route::get('/customers/{user}/json', [CustomerController::class, 'show'])->name('customers.show.json');
        Route::get('/customers/statistics', [CustomerController::class, 'statistics'])->name('customers.statistics');

        Route::get('/dashboard', [CustomerController::class, 'dashboard'])->name('admin.dashboard');

        Route::get('/sales', [SalesController::class, 'index'])->name('admin.sales');
        Route::patch('/sales/{product}', [SalesController::class, 'update'])->name('admin.sales.update');
    });
});

require __DIR__.'/auth.php';

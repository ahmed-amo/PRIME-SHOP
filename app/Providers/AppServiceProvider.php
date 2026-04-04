<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Product;
use App\Models\VendorOrder;
use App\Policies\ProductPolicy;
use App\Policies\VendorOrderPolicy;
use App\Support\ShopHomeCache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(Product::class, ProductPolicy::class);
        Gate::policy(VendorOrder::class, VendorOrderPolicy::class);

        $forgetHome = static fn () => ShopHomeCache::forget();

        Product::saved($forgetHome);
        Product::deleted($forgetHome);
        Category::saved($forgetHome);
        Category::deleted($forgetHome);
    }
}

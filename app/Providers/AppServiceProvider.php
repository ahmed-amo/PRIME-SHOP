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
use Spatie\MediaLibrary\MediaCollections\Models\Media;

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

        // Gallery lives on R2; keep denormalized URLs + home cache in sync when media changes.
        Media::saved(function (Media $media) use ($forgetHome): void {
            $forgetHome();
            $model = $media->model;
            if ($model instanceof Product && $media->collection_name === 'gallery') {
                $model->syncGalleryUrlsFromMedia();
            }
        });

        Media::deleted(function (Media $media) use ($forgetHome): void {
            $forgetHome();
            if ($media->model_type !== Product::class || $media->collection_name !== 'gallery') {
                return;
            }
            $product = Product::query()->find($media->getAttribute('model_id'));
            $product?->syncGalleryUrlsFromMedia();
        });
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Contracts\View\View;

/**
 * Example Blade page: product gallery using R2 public URLs.
 * Route: see routes/web.php (optional; remove if you only use Inertia).
 */
class ProductGalleryBladeController extends Controller
{
    public function show(Product $product): View
    {
        $product->load('media');

        $urls = $product->gallery_urls
            ?? $product->getMedia('gallery')->map(fn ($m) => $m->getUrl())->filter()->values()->all();

        return view('products.gallery', [
            'product' => $product,
            'galleryUrls' => $urls,
        ]);
    }
}

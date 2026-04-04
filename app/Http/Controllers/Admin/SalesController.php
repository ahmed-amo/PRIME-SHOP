<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProductSaleRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SalesController extends Controller
{
    public function index(): Response
    {
        $products = Product::with('category')
            ->orderBy('name')
            ->paginate(50)
            ->withQueryString()
            ->through(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'price' => (float) $product->price,
                'compare_at_price' => $product->compare_at_price !== null ? (float) $product->compare_at_price : null,
                'discount_percentage' => $product->sale_discount_percentage,
                'is_on_sale' => $product->isOnSale(),
                /** Legacy compare-at row: can clear struck-through price from this screen. */
                'has_compare_at_sale' => $product->compare_at_price !== null
                    && (float) $product->compare_at_price > (float) $product->price,
                'stock' => (int) $product->stock,
                'category' => $product->category?->name,
                'image_url' => $product->galleryImageUrl(),
            ]);

        return Inertia::render('Dashboard/Admin/Sales', [
            'products' => $products,
        ]);
    }

    public function update(UpdateProductSaleRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        $product->update([
            'price' => $validated['price'],
            'compare_at_price' => $validated['compare_at_price'] ?? null,
        ]);

        return back()->with('success', 'Sale pricing updated.');
    }
}

<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    public function store(Request $request, Product $product): RedirectResponse
    {
        if ($product->vendor && $product->vendor->status !== 'active') {
            abort(404);
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'body' => ['nullable', 'string', 'max:2000'],
        ]);

        $user = $request->user();
        if (! $user) {
            abort(403);
        }

        if (ProductReview::where('user_id', $user->id)->where('product_id', $product->id)->exists()) {
            return back()->withErrors(['rating' => __('review_duplicate')]);
        }

        $hasDelivered = Order::where('user_id', $user->id)
            ->where('status', 'delivered')
            ->whereHas('items', fn ($q) => $q->where('product_id', $product->id))
            ->exists();

        if (! $hasDelivered) {
            return back()->withErrors(['rating' => __('review_not_eligible')]);
        }

        ProductReview::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => $validated['rating'],
            'body' => $validated['body'] ?? null,
        ]);

        return back()->with('review_submitted', true);
    }
}

<?php

namespace App\Http\Controllers\User;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Support\Currency;

class OrderController extends Controller
{

    public function myOrders()
{
    $orders = Order::with('items.product')
        ->where('user_id', Auth::id())
        ->latest()
        ->get()
        ->map(function ($order) {
            return [
                'id' => $order->order_number,
                'date' => $order->created_at->format('Y-m-d H:i:s'),
                'status' => ucfirst($order->status),
                'total' => Currency::da($order->total),
                'items' => $order->items->map(function ($item) {
                    return [
                        'product_id' => $item->product_id,
                        'product_slug' => $item->product?->slug,
                        'product_name' => $item->product_name,
                        'quantity' => $item->quantity,
                        'price' => Currency::da($item->product_price),
                        'image' => $item->product?->galleryImageUrl() ?? '/placeholder.svg',
                    ];
                }),
            ];
        });

    return Inertia::render('Dashboard/Client/Orders', [
        'orders' => $orders,
    ]);
}


}

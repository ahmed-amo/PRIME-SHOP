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
                'total' => '$' . number_format($order->total, 2),
                'items' => $order->items->map(function ($item) {
                    return [
                        'name' => $item->product_name,
                        'quantity' => $item->quantity,
                        'price' => '$' . number_format($item->product_price, 2),
                        'image' => $item->product && $item->product->image
                            ? asset('storage/' . $item->product->image)
                            : '/placeholder.svg',
                    ];
                }),
            ];
        });

    return Inertia::render('Dashboard/Client/Orders', [
        'orders' => $orders,
    ]);
}


}

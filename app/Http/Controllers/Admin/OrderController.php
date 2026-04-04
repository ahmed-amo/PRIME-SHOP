<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->with(['items'])
            ->latest()
            ->get()
            ->map(function (Order $order) {
                return [
                    'id' => $order->order_number,
                    'order_id' => $order->id,
                    'customer' => $order->customer_name,
                    'email' => $order->customer_email,
                    'date' => optional($order->created_at)->format('Y-m-d'),
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'items' => (int) $order->items->sum('quantity'),
                    'products' => $order->items->map(function ($item) {
                        return [
                            'name' => $item->product_name,
                            'quantity' => (int) $item->quantity,
                            'price' => (float) $item->product_price,
                        ];
                    })->values(),
                ];
            })
            ->values();

        return Inertia::render('Dashboard/Admin/ClientOrders', [
            'orders' => $orders,
        ]);
    }

    public function confirm(Order $order): RedirectResponse
    {
        if ($order->status === 'pending') {
            $order->update(['status' => 'confirmed']);
        }

        return back();
    }
}


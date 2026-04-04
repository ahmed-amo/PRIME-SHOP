<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminOrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->with(['user'])
            ->withCount('vendorOrders')
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(function (Order $order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer_name,
                    'customer_email' => $order->customer_email,
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at?->toIso8601String(),
                    'vendor_count' => $order->vendor_orders_count,
                ];
            });

        return Inertia::render('SuperAdmin/Orders', [
            'orders' => $orders,
        ]);
    }
}

<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Support\Currency;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ClientDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $userId = Auth::id();

        $base = Order::query()->where('user_id', $userId);

        $totalOrders = (clone $base)->count();
        $activeOrders = (clone $base)->whereIn('status', ['pending', 'confirmed', 'shipped'])->count();
        $completedOrders = (clone $base)->where('status', 'delivered')->count();

        $recentOrders = (clone $base)
            ->with('items')
            ->latest()
            ->limit(5)
            ->get()
            ->map(static function (Order $order): array {
                return [
                    'id' => $order->order_number,
                    'date' => $order->created_at->format('Y-m-d'),
                    'status' => ucfirst((string) $order->status),
                    'status_key' => $order->status,
                    'total' => Currency::da($order->total),
                    'items_count' => (int) $order->items->sum('quantity'),
                ];
            });

        return Inertia::render('Dashboard/Client/Dashpage', [
            'stats' => [
                'total_orders' => $totalOrders,
                'active_orders' => $activeOrders,
                'completed_orders' => $completedOrders,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}

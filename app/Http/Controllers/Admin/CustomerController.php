<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers with statistics
     */
    public function index(Request $request)
    {
        // Get all users with their orders (eager loading to prevent N+1 queries)
        $users = User::with('orders')
            ->whereHas('orders') // Only users who have placed orders
            ->latest()
            ->get();

        // Format customer data with calculated fields
        $customers = $users->map(function ($user) {
            return [
                'id' => 'CUST-' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? 'N/A',
                'address' => $user->address ?? 'No address provided',
                'joinDate' => $user->created_at->format('Y-m-d'),
                'totalOrders' => $user->orders->count(),
                'totalSpent' => (float) $user->orders->sum('total'),
                'status' => $user->orders->count() > 0 ? 'active' : 'inactive',
                'avatar' => $user->picture ? asset('storage/' . $user->picture) : null,
            ];
        });

        // Calculate global statistics
        $stats = [
            'totalCustomers' => User::whereHas('orders')->count(),
            'totalOrders' => Order::count(),
            'totalRevenue' => (float) Order::sum('total'),
        ];

        return Inertia::render('Dashboard/Admin/Customers', [
            'customers' => $customers,
            'stats' => $stats,
        ]);
    }

    /**
     * Display detailed information about a specific customer
     */
    public function show($userId)
    {
        // Find the user with their orders and order items
        $user = User::with(['orders' => function($query) {
            $query->latest(); // Order by most recent first
        }, 'orders.items.product'])
            ->findOrFail($userId);

        // Format customer details with full order history
        $customer = [
            'id' => 'CUST-' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? 'N/A',
            'address' => $user->address ?? 'No address provided',
            'joinDate' => $user->created_at->format('F d, Y'),
            'totalOrders' => $user->orders->count(),
            'totalSpent' => (float) $user->orders->sum('total'),
            'averageOrderValue' => $user->orders->count() > 0
                ? (float) $user->orders->avg('total')
                : 0,
            'status' => $user->orders->count() > 0 ? 'active' : 'inactive',
            'avatar' => $user->picture ? asset('storage/' . $user->picture) : null,

            // Complete order history with items
            'orders' => $user->orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'date' => $order->created_at->format('F d, Y'),
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'payment_method' => $order->payment_method,
                    'subtotal' => (float) $order->subtotal,
                    'tax' => (float) ($order->tax ?? 0),
                    'shipping_cost' => (float) $order->shipping_cost,
                    'total' => (float) $order->total,
                    'shipping_address' => $order->shipping_address,
                    'delivery_type' => $order->delivery_type,
                    'notes' => $order->notes,

                    // Order items
                    'items' => $order->items->map(function ($item) {
                        return [
                            'product_name' => $item->product_name,
                            'quantity' => $item->quantity,
                            'price' => (float) $item->product_price,
                            'subtotal' => (float) $item->subtotal,
                            'image' => $item->product && $item->product->image
                                ? asset('storage/' . $item->product->image)
                                : null,
                        ];
                    }),
                ];
            }),
        ];

        // Check if this is a JSON request (for the /json route)
        if (request()->wantsJson() || str_ends_with(request()->path(), '/json')) {
            return response()->json([
                'customer' => $customer,
            ]);
        }

        // Otherwise render the Inertia page
        return Inertia::render('Dashboard/Admin/CustomerDetail', [
            'customer' => $customer,
        ]);
    }

    /**
     * Display dashboard with statistics
     */
    public function dashboard()
    {
        // Get basic stats
        $stats = [
            'totalCustomers' => User::whereHas('orders')->count(),
            'totalOrders' => Order::count(),
            'totalRevenue' => (float) Order::sum('total'),
        ];

        // Get detailed statistics
        $detailedStats = $this->getDetailedStatistics();

        return Inertia::render('Dashboard/Admin/Stats', [
            'stats' => array_merge($stats, $detailedStats),
        ]);
    }

    /**
     * Get detailed statistics
     */
    private function getDetailedStatistics()
    {
        // Monthly customer registrations (last 6 months)
        $monthlyRegistrations = User::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Top 5 customers by spending
        $topCustomers = User::with('orders')
            ->get()
            ->map(function ($user) {
                return [
                    'name' => $user->name,
                    'totalSpent' => (float) $user->orders->sum('total'),
                    'totalOrders' => $user->orders->count(),
                ];
            })
            ->sortByDesc('totalSpent')
            ->take(5)
            ->values();

        // Customer activity status
        $activeCustomers = User::whereHas('orders', function ($query) {
            $query->where('created_at', '>=', now()->subMonths(3));
        })->count();

        $inactiveCustomers = User::whereHas('orders')
            ->whereDoesntHave('orders', function ($query) {
                $query->where('created_at', '>=', now()->subMonths(3));
            })->count();

        return [
            'monthlyRegistrations' => $monthlyRegistrations,
            'topCustomers' => $topCustomers,
            'activeCustomers' => $activeCustomers,
            'inactiveCustomers' => $inactiveCustomers,
        ];
    }

    /**
     * Get customer statistics for analytics (API endpoint)
     */
    public function statistics()
    {
        $detailedStats = $this->getDetailedStatistics();

        return response()->json($detailedStats);
    }
}

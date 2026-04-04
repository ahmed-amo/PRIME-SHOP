<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Vendor;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('SuperAdmin/Dashboard', [
            'stats' => [
                'totalVendors' => Vendor::query()->count(),
                'totalCustomers' => User::query()->role('customer')->count(),
                'totalOrders' => Order::query()->count(),
                'totalRevenue' => 0,
            ],
        ]);
    }
}

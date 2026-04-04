<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VendorDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $vendor = $request->user()->vendor;

        abort_unless($vendor, 403);

        $success = $request->session()->pull('success');

        return Inertia::render('Vendor/Dashboard', [
            'flash' => [
                'success' => $success,
            ],
            'stats' => [
                'totalProducts' => $vendor->products()->count(),
                'totalOrders' => $vendor->vendorOrders()->count(),
                'pendingOrders' => $vendor->vendorOrders()->where('status', 'pending')->count(),
                'totalRevenue' => 0,
            ],
        ]);
    }
}

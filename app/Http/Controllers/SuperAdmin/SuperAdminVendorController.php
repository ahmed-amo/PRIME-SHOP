<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminVendorController extends Controller
{
    public function index(): Response
    {
        $vendors = Vendor::query()
            ->with(['user'])
            ->withCount(['products', 'vendorOrders'])
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString()
            ->through(function (Vendor $v) {
                return [
                    'id' => $v->id,
                    'shop_name' => $v->shop_name,
                    'owner_email' => $v->user?->email,
                    'product_count' => $v->products_count,
                    'order_count' => $v->vendor_orders_count,
                    'status' => $v->status,
                ];
            });

        return Inertia::render('SuperAdmin/Vendors', [
            'vendors' => $vendors,
        ]);
    }

    public function updateStatus(Request $request, Vendor $vendor): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,active,suspended'],
        ]);

        $vendor->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Vendor status updated.');
    }
}

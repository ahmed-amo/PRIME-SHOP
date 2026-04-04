<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\VendorOrder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VendorOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', VendorOrder::class);

        $status = $request->query('status', 'all');

        $query = VendorOrder::query()
            ->with('order')
            ->latest();

        if (is_string($status) && $status !== '' && $status !== 'all') {
            $query->where('status', $status);
        }

        $orders = $query
            ->paginate(15)
            ->withQueryString()
            ->through(function (VendorOrder $vo) {
                $order = $vo->order;

                return [
                    'id' => $vo->id,
                    'order_number' => $order?->order_number,
                    'customer_name' => $order?->customer_name,
                    'subtotal' => (float) $vo->subtotal,
                    'status' => $vo->status,
                    'created_at' => $vo->created_at?->toIso8601String(),
                ];
            });

        return Inertia::render('Vendor/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'status' => is_string($status) ? $status : 'all',
            ],
        ]);
    }

    public function show(Request $request, VendorOrder $vendorOrder): Response
    {
        $this->authorize('view', $vendorOrder);

        $vendorOrder->load(['order', 'orderItems.product']);

        $order = $vendorOrder->order;

        return Inertia::render('Vendor/Orders/Show', [
            'vendorOrder' => [
                'id' => $vendorOrder->id,
                'status' => $vendorOrder->status,
                'subtotal' => (float) $vendorOrder->subtotal,
                'created_at' => $vendorOrder->created_at?->toIso8601String(),
            ],
            'order' => $order ? [
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'created_at' => $order->created_at?->toIso8601String(),
            ] : null,
            'items' => $vendorOrder->orderItems->map(fn ($item) => [
                'id' => $item->id,
                'product_name' => $item->product_name,
                'quantity' => (int) $item->quantity,
                'unit_price' => (float) $item->product_price,
                'line_total' => (float) $item->subtotal,
            ]),
        ]);
    }

    public function update(Request $request, VendorOrder $vendorOrder): RedirectResponse
    {
        $this->authorize('update', $vendorOrder);

        $validated = $request->validate([
            'status' => ['required', 'in:pending,processing,shipped,delivered,cancelled'],
        ]);

        $vendorOrder->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Order status updated.');
    }
}

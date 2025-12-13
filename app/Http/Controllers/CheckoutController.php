<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckoutController extends Controller
{


    public function index(Request $request)
    {
        return Inertia::render('Checkout/CheckOutIndex');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'shipping_address' => 'required|string|max:255',
            'payment_method' => 'required|string|in:cash,card,paypal',
            'notes' => 'nullable|string|max:1000',
            'cart_items' => 'required|array|min:1',
            'cart_items.*.id' => 'required|exists:products,id',
            'cart_items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $subtotal = 0;
            $orderItems = [];

            foreach ($validated['cart_items'] as $cartItem) {
                $product = Product::findOrFail($cartItem['id']);

                if ($product->stock < $cartItem['quantity']) {
                    DB::rollBack();
                    return back()->withErrors(['cart' => "Insufficient stock for {$product->name}"]);
                }

                $itemSubtotal = $product->price * $cartItem['quantity'];
                $subtotal += $itemSubtotal;

                $orderItems[] = [
                    'product' => $product,
                    'quantity' => $cartItem['quantity'],
                    'subtotal' => $itemSubtotal,
                ];
            }

            $shippingCost = 80.00;
            $total = $subtotal + $shippingCost;

            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => Auth::id(), // This should work now
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'],
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'product_name' => $item['product']->name,
                    'product_price' => $item['product']->price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['subtotal'],
                ]);

                $item['product']->decrement('stock', $item['quantity']);
            }

            DB::commit();

            return redirect()->route('orders.success', $order->order_number);

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Failed to place order. Please try again.']);
        }
    }

    public function success($orderNumber)
    {
        $order = Order::with('items.product')
            ->where('order_number', $orderNumber)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('Checkout/Success', [
            'order' => [
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'shipping_address' => $order->shipping_address,
                'total' => (float) $order->total,
                'subtotal' => (float) $order->subtotal,
                'tax' => (float) $order->tax,
                'shipping_cost' => (float) $order->shipping_cost,
                'status' => $order->status,
                'created_at' => $order->created_at->format('F d, Y'),
                'items' => $order->items->map(function ($item) {
                    return [
                        'product_name' => $item->product_name,
                        'quantity' => $item->quantity,
                        'price' => (float) $item->product_price,
                        'subtotal' => (float) $item->subtotal,
                    ];
                }),
            ],
        ]);
    }

    public function myOrders()
    {
        $orders = Order::with('items')
            ->where('user_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'order_number' => $order->order_number,
                    'date' => $order->created_at->format('Y-m-d'),
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'items_count' => $order->items->sum('quantity'),
                ];
            });

        return Inertia::render('Orders/MyOrders', [
            'orders' => $orders,
        ]);
    }
}

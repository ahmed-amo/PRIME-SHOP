<?php

namespace App\Http\Controllers;

use Stripe\Stripe;
use Stripe\Checkout\Session;
use App\Mail\OrderConfirmationMail;
use Illuminate\Support\Facades\Mail;
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
            'customer_name'        => 'required|string|max:255',
            'customer_email'       => 'required|email|max:255',
            'customer_phone'       => 'nullable|string|max:20',
            'delivery_type'        => 'required|in:home,business,pickup',
            'shipping_address'     => 'required|string|max:255',
            'payment_method'       => 'required|string|in:cash,card,paypal,chargily,wallet',
            'notes'                => 'nullable|string|max:1000',
            'cart_items'           => 'required|array|min:1',
            'cart_items.*.id'      => 'required|exists:products,id',
            'cart_items.*.quantity'=> 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $subtotal   = 0;
            $orderItems = [];

            foreach ($validated['cart_items'] as $cartItem) {
                $product = Product::findOrFail($cartItem['id']);

                if ($product->stock < $cartItem['quantity']) {
                    DB::rollBack();
                    return back()->withErrors(['cart' => "Insufficient stock for {$product->name}"]);
                }

                $itemSubtotal = $product->price * $cartItem['quantity'];
                $subtotal    += $itemSubtotal;

                $orderItems[] = [
                    'product'  => $product,
                    'quantity' => $cartItem['quantity'],
                    'subtotal' => $itemSubtotal,
                ];
            }

            $shippingCost = 80.00;
            $total        = $subtotal + $shippingCost;

            $order = Order::create([
                'order_number'    => Order::generateOrderNumber(),
                'user_id'         => Auth::id(),
                'customer_name'   => $validated['customer_name'],
                'customer_email'  => $validated['customer_email'],
                'customer_phone'  => $validated['customer_phone'],
                'shipping_address'=> $validated['shipping_address'],
                'delivery_type'   => $validated['delivery_type'],
                'subtotal'        => $subtotal,
                'shipping_cost'   => $shippingCost,
                'total'           => $total,
                'payment_method'  => $validated['payment_method'],
                'notes'           => $validated['notes'],
                'status'          => 'pending',
                'payment_status'  => 'pending',
            ]);

            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $item['product']->id,
                    'product_name' => $item['product']->name,
                    'product_price'=> $item['product']->price,
                    'quantity'     => $item['quantity'],
                    'subtotal'     => $item['subtotal'],
                ]);

                $item['product']->decrement('stock', $item['quantity']);
            }

            DB::commit();

            // -----------------------------------------------
            // CARD → redirect to Stripe, do NOT send email yet
            // Email is sent by the webhook after payment
            // -----------------------------------------------
            if ($validated['payment_method'] === 'card') {
                Stripe::setApiKey(config('services.stripe.secret'));

                $lineItems = [];

                foreach ($orderItems as $item) {
                    $lineItems[] = [
                        'price_data' => [
                            'currency'     => 'dzd',
                            'unit_amount'  => (int) ($item['product']->price * 100),
                            'product_data' => [
                                'name' => $item['product']->name,
                            ],
                        ],
                        'quantity' => $item['quantity'],
                    ];
                }

                // Add shipping as a line item
                $lineItems[] = [
                    'price_data' => [
                        'currency'     => 'dzd',
                        'unit_amount'  => (int) ($shippingCost * 100),
                        'product_data' => [
                            'name' => 'Shipping',
                        ],
                    ],
                    'quantity' => 1,
                ];

                $stripeSession = Session::create([
                    'payment_method_types' => ['card'],
                    'line_items'           => $lineItems,
                    'mode'                 => 'payment',
                    'success_url'          => route('orders.success', $order->order_number),
                    'cancel_url'           => route('checkout.index'),
                    'customer_email'       => $order->customer_email,
                    'metadata'             => [
                        'order_id' => $order->id,
                    ],
                ]);

                return Inertia::location($stripeSession->url);
            }

            // -----------------------------------------------
            // CASH / PAYPAL → go straight to success + email
            // -----------------------------------------------
            Mail::to($order->customer_email)->queue(new OrderConfirmationMail($order));
            return Inertia::location(route('orders.success', $order->order_number));

        } catch (\Throwable $e) {
            DB::rollBack();
            dd(
                'CHECKOUT ERROR',
                $e->getMessage(),
                $e->getFile(),
                $e->getLine()
            );
        }
    }

    public function success($orderNumber)
    {
        $order = Order::with('items.product')
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        return Inertia::render('Checkout/Success', [
            'order' => [
                'order_number'    => $order->order_number,
                'customer_name'   => $order->customer_name,
                'customer_email'  => $order->customer_email,
                'shipping_address'=> $order->shipping_address,
                'delivery_type'   => $order->delivery_type,
                'total'           => (float) $order->total,
                'subtotal'        => (float) $order->subtotal,
                'tax'             => (float) $order->tax,
                'shipping_cost'   => (float) $order->shipping_cost,
                'status'          => $order->status,
                'payment_method'  => $order->payment_method,
                'created_at'      => $order->created_at->format('F d, Y'),
                'items'           => $order->items->map(function ($item) {
                    return [
                        'product_name' => $item->product_name,
                        'quantity'     => $item->quantity,
                        'price'        => (float) $item->product_price,
                        'subtotal'     => (float) $item->subtotal,
                        'image'        => $item->product && $item->product->image
                            ? asset('storage/' . $item->product->image)
                            : null,
                    ];
                }),
            ],
        ]);
    }
}

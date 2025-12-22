"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ShopFrontLayout from "@/layouts/shop-layout"
import { CheckCircle, Package, MapPin, CreditCard, Calendar, ArrowRight, Download } from "lucide-react"

// Mock order data - in real app this comes from Inertia props
const mockOrder = {
  order_number: "ORD-A3F9B2",
  customer_name: "John Doe",
  customer_email: "john@example.com",
  shipping_address: "123 Main Street, Apt 4B",
  shipping_city: "New York",
  shipping_state: "NY",
  shipping_zip: "10001",
  shipping_country: "United States",
  total: 219.97,
  subtotal: 199.97,
  tax: 20.0,
  shipping_cost: 10.0,
  status: "pending",
  created_at: "December 11, 2024",
  items: [
    { product_name: "Wireless Headphones", quantity: 1, price: 149.99, subtotal: 149.99 },
    { product_name: "Phone Case", quantity: 2, price: 29.99, subtotal: 59.98 },
  ],
}

export default function OrderSuccess({ order = mockOrder }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your order, {order.customer_name}
          </p>
          <p className="text-gray-500">
            A confirmation email has been sent to{" "}
            <span className="font-medium text-gray-700">{order.customer_email}</span>
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Order Number Card */}
          <Card className="border-orange-200 shadow-xl bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="text-3xl font-bold text-orange-600">{order.order_number}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    onClick={() => (window.location.href = "/my-orders")}
                  >
                    View All Orders
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Details */}
            <Card className="border-orange-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-900">{order.created_at}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-yellow-600 capitalize">{order.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">Credit Card</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-orange-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{order.customer_name}</p>
                  <p className="text-gray-600">{order.shipping_address}</p>
                  <p className="text-gray-600">
                    {order.shipping_city}
                    {order.shipping_state && `, ${order.shipping_state}`} {order.shipping_zip}
                  </p>
                  <p className="text-gray-600">{order.shipping_country}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card className="border-orange-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${item.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${order.shipping_cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-orange-600">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="border-orange-100 shadow-lg bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Confirmation</p>
                    <p className="text-sm text-gray-600">
                      You'll receive an email confirmation shortly
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Processing</p>
                    <p className="text-sm text-gray-600">
                      We'll prepare your items for shipment
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Shipping Updates</p>
                    <p className="text-sm text-gray-600">
                      Track your order with the tracking number we'll send you
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              variant="outline"
              size="lg"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
              onClick={() => (window.location.href = "/")}
            >
              Continue Shopping
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              onClick={() => (window.location.href = "/my-orders")}
            >
              Track Your Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
OrderSuccess.layout = (page: React.ReactNode) => <ShopFrontLayout>{page}</ShopFrontLayout>

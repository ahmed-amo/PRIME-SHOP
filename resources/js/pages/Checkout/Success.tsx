"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ShopFrontLayout from "@/layouts/shop-layout"
import { CheckCircle, Package, MapPin, CreditCard, Calendar, ArrowRight, ShoppingBag, Truck, Gift, Sparkles } from "lucide-react"
import { router } from "@inertiajs/react"
import { useCart } from "@/contexts/cartContext"
import { Order } from "@/types/order"

interface OrderSuccessProps {
  order: Order
}

export default function OrderSuccess({ order }: OrderSuccessProps) {
  const { clearCart } = useCart()
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Clear cart when order is successful
    clearCart()

    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#f97316', '#fb923c', '#fdba74', '#fbbf24', '#fcd34d'][Math.floor(Math.random() * 5)]
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        {/* Success Header with Animation */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full mb-8 shadow-2xl animate-scaleIn relative">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
            <CheckCircle className="h-14 w-14 text-white relative z-10" strokeWidth={2.5} />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-orange-500 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-black text-gray-900">
              Order Confirmed!
            </h1>
            <Sparkles className="h-6 w-6 text-orange-500 animate-pulse" />
          </div>

          <p className="text-2xl text-gray-700 mb-3 font-medium">
            Thank you, <span className="text-orange-600 font-bold">{order.customer_name}</span>! 🎉
          </p>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your order has been successfully placed and is being processed.
            We've sent a confirmation email to{" "}
            <span className="font-semibold text-gray-800">{order.customer_email}</span>
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Order Number - Hero Card */}
          <Card className="border-none shadow-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48"></div>

            <CardContent className="p-8 md:p-10 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                    <Gift className="h-6 w-6 text-orange-100" />
                    <p className="text-orange-100 font-semibold text-lg uppercase tracking-wide">
                      Order Number
                    </p>
                  </div>
                  <p className="text-5xl md:text-6xl font-black text-white tracking-tight mb-2">
                    {order.order_number}
                  </p>
                  <p className="text-orange-100 text-sm">Keep this number for tracking</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => router.visit('/')}
                    variant="outline"
                    size="lg"
                    className="bg-white/90 hover:bg-white text-orange-600 border-none font-semibold shadow-lg"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Continue Shopping
                  </Button>
                  <Button
                    onClick={() => router.visit('/client/my-orders')}
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-orange-50 border-none font-semibold shadow-lg"
                  >
                    My Orders
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Order Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card className="border-2 border-orange-100 shadow-xl bg-white">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Package className="h-6 w-6" />
                    Your Items ({order.items.length})
                  </h2>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-5">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-5 pb-5 border-b border-gray-100 last:border-b-0 hover:bg-orange-50 p-4 rounded-xl transition-colors"
                      >
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.product_name}
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            <Package className="h-10 w-10 text-orange-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-lg mb-1">{item.product_name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <span className="font-semibold text-gray-700">${item.price.toFixed(2)}</span>
                              <span>per item</span>
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="font-semibold text-orange-600">Qty: {item.quantity}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-black text-gray-900">${item.subtotal.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary */}
                  <div className="mt-8 pt-6 border-t-2 border-gray-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl">
                    <div className="space-y-4">
                      <div className="flex justify-between text-base">
                        <span className="text-gray-700 font-medium">Subtotal</span>
                        <span className="font-bold text-gray-900">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-gray-700 font-medium">Tax (10%)</span>
                        <span className="font-bold text-gray-900">${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base pb-4 border-b border-orange-200">
                        <span className="text-gray-700 font-medium flex items-center gap-2">
                          <Truck className="h-4 w-4 text-orange-600" />
                          Shipping
                        </span>
                        <span className="font-bold text-gray-900">${order.shipping_cost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-2xl font-black pt-2">
                        <span className="text-gray-900">Total Paid</span>
                        <span className="text-orange-600">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Order Status */}
              <Card className="border-2 border-orange-100 shadow-xl bg-white overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Order Info
                  </h3>
                </div>
                <CardContent className="p-6 space-y-5">
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-yellow-800 mb-2">Current Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="font-bold text-yellow-700 text-lg capitalize">{order.status}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-2">Order Date</p>
                    <p className="font-bold text-gray-900 text-lg">{order.created_at}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-2">Payment Method</p>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold text-gray-900 capitalize">{order.payment_method}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="border-2 border-orange-100 shadow-xl bg-white overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </h3>
                </div>
                <CardContent className="p-6">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border-2 border-orange-100">
                    <p className="font-bold text-gray-900 mb-3 text-lg">{order.customer_name}</p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {order.shipping_address}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* What's Next */}
              <Card className="border-2 border-orange-100 shadow-xl bg-gradient-to-br from-orange-50 to-white overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <Truck className="h-6 w-6 text-orange-600" />
                    What's Next?
                  </h3>
                  <div className="space-y-4">
                    {[
                      { step: "1", title: "Email Confirmation", desc: "Check your inbox for order details" },
                      { step: "2", title: "Processing", desc: "We're preparing your items" },
                      { step: "3", title: "Shipping", desc: "You'll receive tracking info soon" }
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-white font-black text-lg">{item.step}</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 mb-1">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-confetti { animation: confetti linear forwards; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-scaleIn { animation: scaleIn 0.5s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
      `}} />
    </div>
  )
}

OrderSuccess.layout = (page: React.ReactNode) => <ShopFrontLayout>{page}</ShopFrontLayout>

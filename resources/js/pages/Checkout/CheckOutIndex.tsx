"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "../../contexts/cartContext"
import { router } from "@inertiajs/react"
import { Package, ArrowRight, CreditCard, ShieldCheck, MapPin, User, Mail, Phone } from "lucide-react"
import ShopFrontLayout from '../../../js/layouts/shop-layout'

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart()
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    payment_method: "card",
    notes: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const shippingCost = 10
  const total = subtotal + tax + shippingCost

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = () => {
    setLoading(true)

    router.post('/checkout', {
      ...form,
      cart_items: cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity
      }))
    }, {
      onError: (err) => {
        setErrors(err)
        setLoading(false)
      },
      onSuccess: () => {
        clearCart()
      },
      onFinish: () => {
        setLoading(false)
      }
    })
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6">
            <Package className="h-12 w-12 text-orange-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to get started</p>
          <Button
            onClick={() => router.visit('/')}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Secure Checkout</h1>
          <p className="text-gray-600 text-lg">Complete your order in a few simple steps</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-5">
                <div className="flex items-center gap-3 text-white">
                  <User className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-600" />
                    Full Name *
                  </Label>
                  <Input
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handleChange}
                    className="h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                    placeholder="John Doe"
                  />
                  {errors.customer_name && <p className="text-red-600 text-sm mt-2">{errors.customer_name}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-orange-600" />
                      Email Address *
                    </Label>
                    <Input
                      name="customer_email"
                      type="email"
                      value={form.customer_email}
                      onChange={handleChange}
                      className="h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                      placeholder="john@example.com"
                    />
                    {errors.customer_email && <p className="text-red-600 text-sm mt-2">{errors.customer_email}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-orange-600" />
                      Phone Number
                    </Label>
                    <Input
                      name="customer_phone"
                      type="tel"
                      value={form.customer_phone}
                      onChange={handleChange}
                      className="h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.customer_phone && <p className="text-red-600 text-sm mt-2">{errors.customer_phone}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-5">
                <div className="flex items-center gap-3 text-white">
                  <MapPin className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>
              </div>
              <div className="p-8">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2">Complete Address *</Label>
                  <Textarea
                    name="shipping_address"
                    value={form.shipping_address}
                    onChange={handleChange}
                    className="resize-none border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                    rows={3}
                    placeholder="123 Main Street, Apt 4B, New York, NY 10001, United States"
                  />
                  <p className="text-sm text-gray-500 mt-2">Include street, city, state, ZIP code, and country</p>
                  {errors.shipping_address && <p className="text-red-600 text-sm mt-2">{errors.shipping_address}</p>}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-5">
                <div className="flex items-center gap-3 text-white">
                  <CreditCard className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2">Select Payment Method *</Label>
                  <Select
                    value={form.payment_method}
                    onValueChange={(value) => setForm(prev => ({ ...prev, payment_method: value }))}
                  >
                    <SelectTrigger className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="cash">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2">Order Notes (Optional)</Label>
                  <Textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    className="resize-none border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                    rows={4}
                    placeholder="Any special instructions for your order?"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Summary
                  </h2>
                </div>

                <div className="p-6">
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-orange-50">
                              <Package className="h-8 w-8 text-orange-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                          <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-600 mt-1">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4 border-t-2 border-gray-200 pt-6">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600 font-medium">Subtotal</span>
                      <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600 font-medium">Tax (10%)</span>
                      <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base pb-4 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Shipping</span>
                      <span className="font-semibold text-gray-900">${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-2">
                      <span className="text-gray-900">Total</span>
                      <span className="text-orange-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Complete Order Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full mt-8 h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg transition-all transform hover:scale-105"
                  >
                    {loading ? (
                      "Processing..."
                    ) : (
                      <>
                        Complete Order
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-600">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span>Secured by SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

CheckoutPage.layout = (page: React.ReactNode) => <ShopFrontLayout>{page}</ShopFrontLayout>

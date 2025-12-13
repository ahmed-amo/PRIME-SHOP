"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "../../contexts/cartContext"
import { router } from "@inertiajs/react"
import { Package, ArrowRight } from "lucide-react"

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart()

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_zip: "",
    shipping_country: "United States",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const shipping = 10
  const total = subtotal + tax + shipping

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
      onSuccess: () => clearCart()
    })
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Your cart is empty</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Almost there — just your shipping details</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
              {/* Name & Email */}
              <div className="space-y-5">
                <h2 className="text-lg font-medium text-gray-900">Contact</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                    <Input
                      name="customer_name"
                      value={form.customer_name}
                      onChange={handleChange}
                      required
                      className="mt-2 h-12 text-base"
                      placeholder="John Doe"
                    />
                    {errors.customer_name && <p className="text-red-600 text-sm mt-1">{errors.customer_name}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      name="customer_email"
                      type="email"
                      value={form.customer_email}
                      onChange={handleChange}
                      required
                      className="mt-2 h-12 text-base"
                      placeholder="john@example.com"
                    />
                    {errors.customer_email && <p className="text-red-600 text-sm mt-1">{errors.customer_email}</p>}
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Shipping Address */}
              <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>
              <div className="space-y-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Street Address</Label>
                  <Input
                    name="shipping_address"
                    value={form.shipping_address}
                    onChange={handleChange}
                    required
                    className="mt-2 h-12 text-base"
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">City</Label>
                    <Input
                      name="shipping_city"
                      value={form.shipping_city}
                      onChange={handleChange}
                      required
                      className="mt-2 h-12"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">State</Label>
                    <Input
                      name="shipping_state"
                      value={form.shipping_state}
                      onChange={handleChange}
                      className="mt-2 h-12"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">ZIP Code</Label>
                    <Input
                      name="shipping_zip"
                      value={form.shipping_zip}
                      onChange={handleChange}
                      required
                      className="mt-2 h-12"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary - Sticky on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-500">× {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 h-14 text-lg font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg transition"
                onClick={handleSubmit}
              >
                {loading ? "Processing..." : (
                  <>
                    Complete Order
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                Secured by SSL • No payment needed today
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

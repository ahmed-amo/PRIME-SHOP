"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "../../contexts/cartContext"
import { router } from "@inertiajs/react"
import { Package, ArrowRight, MapPin, User, Mail, Phone, CheckCircle, AlertCircle, ShieldCheck, Zap } from "lucide-react"
import ShopFrontLayout from '../../../js/layouts/shop-layout'
import { useI18n } from "@/lib/i18n"

interface CheckoutPageProps {
  auth: {
    user?: {
      name?: string
      email?: string
      phone?: string
      address?: string
    }
  }
}

// ── Payment Options ──────────────────────────────────────────
const paymentOptions = [
  {
    id: "cash",
    label: "Cash on Delivery",
    description: "Pay when you receive your order",
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="6" width="20" height="13" rx="2" />
        <circle cx="12" cy="12.5" r="2.5" />
        <path d="M6 9.5h.01M18 9.5h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "chargily",
    label: "Chargily Pay",
    description: "CIB · Edahabia · Chargily Credit",
    color: "from-[#00b37d] to-[#00c98a]",
    bg: "bg-[#e6fff6]",
    text: "text-[#00b37d]",
    icon: () => (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <rect width="40" height="40" rx="10" fill="#00b37d"/>
        <path d="M23 8L13 22h8l-4 10 14-16h-9l1-8z" fill="white" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Visa · Mastercard · Stripe",
    color: "from-violet-500 to-indigo-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
    icon: () => (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <rect width="40" height="40" rx="10" fill="#7c3aed"/>
        <rect x="6" y="11" width="28" height="18" rx="3" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5"/>
        <rect x="6" y="16" width="28" height="5" fill="white" fillOpacity="0.3"/>
        <rect x="10" y="22" width="8" height="4" rx="1" fill="white" fillOpacity="0.6"/>
        <text x="30" y="27" fontSize="5.5" fill="white" fontWeight="bold" fontFamily="serif" textAnchor="end">VISA</text>
      </svg>
    ),
  },
  {
    id: "paypal",
    label: "PayPal",
    description: "Pay with your PayPal account",
    color: "from-[#003087] to-[#009cde]",
    bg: "bg-blue-50",
    text: "text-[#003087]",
    icon: () => (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <rect width="40" height="40" rx="10" fill="#003087"/>
        <path d="M26.5 11.5c.8 1.1.9 2.5.5 4.1-.9 4.5-4 6-7.8 6H17l-1.5 9.4H12l3.5-21h7.2c2.2 0 3.4.6 3.8 1.5z" fill="#009cde"/>
        <path d="M15.5 25.5h2.2c3.8 0 6.9-1.5 7.8-6 .4-1.6.3-3-.5-4.1C24.6 14.5 23.4 14 21.2 14H16l-3.5 21h3.5l1.5-9.5h-2z" fill="white" fillOpacity="0.9"/>
      </svg>
    ),
  },
]

// ── Delivery Options (2 only, big + colorful) ────────────────
const deliveryOptions = [
  {
    value: "home",
    label: "Home Delivery",
    desc: "Delivered to your door",
    color: "from-orange-400 to-rose-500",
    bg: "bg-orange-50",
    text: "text-orange-500",
    icon: () => (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect width="48" height="48" rx="14" fill="url(#homeGrad)"/>
        <defs>
          <linearGradient id="homeGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fb923c"/>
            <stop offset="1" stopColor="#f43f5e"/>
          </linearGradient>
        </defs>
        {/* House */}
        <path d="M24 12L36 22V38H28V30H20V38H12V22L24 12Z" fill="white" fillOpacity="0.95"/>
        <rect x="20" y="30" width="8" height="8" rx="1" fill="url(#homeGrad)"/>
        {/* Chimney */}
        <rect x="28" y="14" width="4" height="6" rx="1" fill="white" fillOpacity="0.7"/>
      </svg>
    ),
  },
  {
    value: "business",
    label: "Desk Delivery",
    desc: "Delivered to your office",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-500",
    icon: () => (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect width="48" height="48" rx="14" fill="url(#deskGrad)"/>
        <defs>
          <linearGradient id="deskGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6"/>
            <stop offset="1" stopColor="#4f46e5"/>
          </linearGradient>
        </defs>
        {/* Building */}
        <rect x="10" y="14" width="28" height="24" rx="2" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5"/>
        {/* Windows */}
        <rect x="14" y="18" width="5" height="5" rx="1" fill="white" fillOpacity="0.8"/>
        <rect x="22" y="18" width="5" height="5" rx="1" fill="white" fillOpacity="0.8"/>
        <rect x="30" y="18" width="4" height="5" rx="1" fill="white" fillOpacity="0.8"/>
        <rect x="14" y="26" width="5" height="5" rx="1" fill="white" fillOpacity="0.8"/>
        <rect x="22" y="26" width="5" height="5" rx="1" fill="white" fillOpacity="0.8"/>
        <rect x="30" y="26" width="4" height="5" rx="1" fill="white" fillOpacity="0.8"/>
        {/* Door */}
        <rect x="20" y="32" width="8" height="6" rx="1" fill="white" fillOpacity="0.6"/>
        {/* Flag on top */}
        <rect x="23" y="8" width="1.5" height="7" fill="white" fillOpacity="0.9"/>
        <path d="M24.5 8.5L29 10.5L24.5 12.5V8.5Z" fill="white"/>
      </svg>
    ),
  },
]

// ── Validation ───────────────────────────────────────────────
function pickFieldError(errors: Record<string, unknown>, key: string): string {
  const v = errors[key]
  if (typeof v === "string") return v
  if (Array.isArray(v) && typeof v[0] === "string") return v[0]
  return ""
}

const defaultForm = {
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  shipping_address: "",
  delivery_type: "home",
  payment_method: "cash",
  notes: "",
}

function validateStep1(form: typeof defaultForm) {
  const errs: Record<string, string> = {}
  if (!form.customer_name.trim())
    errs.customer_name = "Full name is required"
  else if (form.customer_name.trim().length < 3)
    errs.customer_name = "Name must be at least 3 characters"
  if (!form.customer_email.trim())
    errs.customer_email = "Email is required"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email))
    errs.customer_email = "Enter a valid email address"
  if (!form.customer_phone.trim())
    errs.customer_phone = "Phone number is required"
  else if (form.customer_phone.trim().length < 9)
    errs.customer_phone = "Enter a valid phone number"
  if (!form.shipping_address.trim())
    errs.shipping_address = "Shipping address is required"
  else if (form.shipping_address.trim().length < 10)
    errs.shipping_address = "Please enter a more complete address"
  return errs
}

function validateStep2(form: typeof defaultForm) {
  const errs: Record<string, string> = {}
  if (!form.payment_method)
    errs.payment_method = "Please select a payment method"
  return errs
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5 font-medium">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </p>
  )
}

// ── Main Component ───────────────────────────────────────────
export default function CheckoutPage({ auth }: CheckoutPageProps) {
  const { t, formatPrice } = useI18n()
  const { cartItems, clearCart } = useCart()
  const [form, setForm] = useState({
    ...defaultForm,
    customer_name: auth?.user?.name || "",
    customer_email: auth?.user?.email || "",
    customer_phone: auth?.user?.phone || "",
    shipping_address: auth?.user?.address || "",
  })
  const [errors, setErrors] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const shippingCost = 80
  const total = subtotal + shippingCost

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (pickFieldError(errors, name)) setErrors(p => ({ ...p, [name]: "" }))
  }

  const goToStep2 = () => {
    const errs = validateStep1(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      document.getElementsByName(Object.keys(errs)[0])[0]?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    setErrors({})
    setStep(2)
    scrollTop()
  }

  const goToStep3 = () => {
    const errs = validateStep2(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setStep(3)
    scrollTop()
  }

  const handleSubmit = () => {
    const allErrs = { ...validateStep1(form), ...validateStep2(form) }
    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs)
      setStep(Object.keys(validateStep1(form)).length > 0 ? 1 : 2)
      scrollTop()
      return
    }
    setLoading(true)
    router.post(route("checkout.store"), {
      ...form,
      cart_items: cartItems.map(i => ({ id: i.id, quantity: i.quantity })),
    }, {
      onSuccess: () => {
        clearCart()
      },
      onError: (err) => {
        setErrors(err as Record<string, unknown>)
        setLoading(false)
        setStep(3)
        scrollTop()
      },
      onFinish: () => setLoading(false),
    })
  }

  const selectedPayment = paymentOptions.find(p => p.id === form.payment_method)!
  const selectedDelivery = deliveryOptions.find(d => d.value === form.delivery_type)!

  const inputCls = (field: string) =>
    `h-11 text-gray-900 placeholder:text-gray-400 bg-white border-gray-200 focus:ring-1 rounded-xl [color-scheme:light] transition-colors ${
      pickFieldError(errors, field) ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "focus:border-orange-400 focus:ring-orange-400"
    }`

  const textareaCls = (field: string) =>
    `text-gray-900 placeholder:text-gray-400 bg-white border-gray-200 focus:ring-1 rounded-xl resize-none [color-scheme:light] transition-colors ${
      pickFieldError(errors, field) ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "focus:border-orange-400 focus:ring-orange-400"
    }`

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some items to get started</p>
          <Button onClick={() => router.visit("/")} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">

      {/* Top stepper nav */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">Prime<span className="text-orange-500">SH</span></span>
          <div className="flex items-center gap-2 text-sm">
            {["Details", "Payment", "Review"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => { if (i + 1 < step) { setStep(i + 1); scrollTop() } }}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${
                    step === i + 1 ? "text-orange-500" : step > i + 1 ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === i + 1 ? "bg-orange-500 text-white" : step > i + 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {step > i + 1 ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s}</span>
                </button>
                {i < 2 && <span className="text-gray-300 mx-1">—</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── LEFT ─────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-5">

            {/* STEP 1 — Details */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Contact & Delivery</h1>
                  <p className="text-gray-500 text-sm mt-1">Tell us where to send your order</p>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-2xl border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-gray-800 text-sm">Contact Info</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        Full Name <span className="text-red-400">*</span>
                      </Label>
                      <Input name="customer_name" value={form.customer_name} onChange={handleChange} className={inputCls("customer_name")} placeholder="Ahmed Amokrane" />
                      <FieldError message={pickFieldError(errors, "customer_name")} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Email <span className="text-red-400">*</span>
                        </Label>
                        <Input name="customer_email" type="email" value={form.customer_email} onChange={handleChange} className={inputCls("customer_email")} placeholder="you@email.com" />
                        <FieldError message={pickFieldError(errors, "customer_email")} />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Phone <span className="text-red-400">*</span>
                        </Label>
                        <Input name="customer_phone" type="tel" value={form.customer_phone} onChange={handleChange} className={inputCls("customer_phone")} placeholder="+213 555 000 000" />
                        <FieldError message={pickFieldError(errors, "customer_phone")} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="bg-white rounded-2xl border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-gray-800 text-sm">Delivery Details</span>
                  </div>
                  <div className="p-6 space-y-5">

                    {/* Delivery type — 2 big colorful cards */}
                    <div>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                        Delivery Type <span className="text-red-400">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        {deliveryOptions.map(opt => {
                          const Icon = opt.icon
                          const isSelected = form.delivery_type === opt.value
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setForm(p => ({ ...p, delivery_type: opt.value }))}
                              className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all text-center ${
                                isSelected
                                  ? `border-transparent bg-gradient-to-br ${opt.color} shadow-lg`
                                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                              }`}
                            >
                              {/* Selected badge */}
                              {isSelected && (
                                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                              )}
                              <Icon />
                              <div>
                                <p className={`font-bold text-base ${isSelected ? "text-white" : "text-gray-800"}`}>
                                  {opt.label}
                                </p>
                                <p className={`text-xs mt-0.5 ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                                  {opt.desc}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        Full Address <span className="text-red-400">*</span>
                      </Label>
                      <Textarea name="shipping_address" value={form.shipping_address} onChange={handleChange} className={textareaCls("shipping_address")} rows={3} placeholder="Street, city, wilaya..." />
                      <FieldError message={pickFieldError(errors, "shipping_address")} />
                    </div>

                    {/* Notes */}
                    <div>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                        Order Notes <span className="text-gray-400 font-normal normal-case">(optional)</span>
                      </Label>
                      <Textarea name="notes" value={form.notes} onChange={handleChange} className={textareaCls("notes")} rows={2} placeholder="Any special instructions?" />
                    </div>
                  </div>
                </div>

                <Button onClick={goToStep2} className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Payment Method</h1>
                  <p className="text-gray-500 text-sm mt-1">Choose how you'd like to pay</p>
                </div>

                <div className="space-y-3">
                  {paymentOptions.map(option => {
                    const Icon = option.icon
                    const isSelected = form.payment_method === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setForm(p => ({ ...p, payment_method: option.id }))
                          if (pickFieldError(errors, "payment_method")) setErrors(p => ({ ...p, payment_method: "" }))
                        }}
                        className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                          isSelected
                            ? `border-transparent bg-gradient-to-r ${option.color} shadow-lg`
                            : pickFieldError(errors, "payment_method")
                              ? "border-red-300 bg-white hover:border-red-400"
                              : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-white/20" : option.bg}`}>
                          <span className={isSelected ? "text-white" : option.text}><Icon /></span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-base ${isSelected ? "text-white" : "text-gray-900"}`}>{option.label}</span>
                            {isSelected && <span className="bg-white/25 text-white text-xs px-2 py-0.5 rounded-full font-medium">Selected</span>}
                          </div>
                          <span className={`text-sm ${isSelected ? "text-white/80" : "text-gray-500"}`}>{option.description}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-white bg-white" : "border-gray-300"}`}>
                          {isSelected && <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${option.color}`} />}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {pickFieldError(errors, "payment_method") && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-red-600 text-sm font-medium">{pickFieldError(errors, "payment_method")}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button onClick={() => { setStep(1); scrollTop() }} variant="outline" className="flex-1 h-12 rounded-xl border-gray-200 text-gray-600 bg-white">Back</Button>
                  <Button onClick={goToStep3} className="flex-[2] h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                    Review Order <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3 — Review */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Review & Confirm</h1>
                  <p className="text-gray-500 text-sm mt-1">Double-check everything before placing your order</p>
                </div>

                {(pickFieldError(errors, "cart") || pickFieldError(errors, "checkout")) && (
                  <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                    <div className="space-y-1">
                      {pickFieldError(errors, "cart") ? <p>{pickFieldError(errors, "cart")}</p> : null}
                      {pickFieldError(errors, "checkout") ? <p>{pickFieldError(errors, "checkout")}</p> : null}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Contact</p>
                        <p className="text-sm font-semibold text-gray-900">{form.customer_name}</p>
                        <p className="text-xs text-gray-500">{form.customer_email}</p>
                        <p className="text-xs text-gray-500">{form.customer_phone}</p>
                      </div>
                    </div>
                    <button onClick={() => { setStep(1); scrollTop() }} className="text-xs text-orange-500 font-semibold hover:underline">Edit</button>
                  </div>

                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${selectedDelivery.color}`}>
                        <selectedDelivery.icon />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Delivery</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedDelivery.label}</p>
                        <p className="text-xs text-gray-500 max-w-xs truncate">{form.shipping_address}</p>
                      </div>
                    </div>
                    <button onClick={() => { setStep(1); scrollTop() }} className="text-xs text-orange-500 font-semibold hover:underline">Edit</button>
                  </div>

                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${selectedPayment.bg} flex items-center justify-center flex-shrink-0`}>
                        <span className={selectedPayment.text}><selectedPayment.icon /></span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Payment</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedPayment.label}</p>
                        <p className="text-xs text-gray-500">{selectedPayment.description}</p>
                      </div>
                    </div>
                    <button onClick={() => { setStep(2); scrollTop() }} className="text-xs text-orange-500 font-semibold hover:underline">Edit</button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => { setStep(2); scrollTop() }} variant="outline" className="flex-1 h-12 rounded-xl border-gray-200 text-gray-600 bg-white">Back</Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[2] h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>Place Order <ArrowRight className="w-4 h-4" /></>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT — Order Summary ─────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-base">Order Summary</span>
                  <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2.5 py-1 rounded-full">
                    {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Items — bigger images */}
                <div className="px-5 py-5 space-y-4 max-h-[420px] overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      {/* Bigger image */}
                      <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <p className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{item.name}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">× {item.quantity}</span>
                          <span className="text-xs text-gray-400">{formatPrice(item.price)} {t("each")}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-800 mt-2">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="px-6 py-4 border-t border-gray-100 space-y-2.5 bg-gray-50">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{t("Subtotal")}</span>
                    <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{t("Shipping")}</span>
                    <span className="font-semibold text-gray-900">{formatPrice(shippingCost)}</span>
                  </div>
                </div>

                {/* Total — attractive CTA block */}
                <div className="bg-gradient-to-br from-orange-500 to-rose-500 px-6 py-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-sm font-medium">{t("Total to Pay")}</span>
                    <span className="text-white text-2xl font-extrabold tracking-tight">{formatPrice(total)}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-white/90" />
                      <span className="text-white/90 text-xs font-medium">{t("Protected")}</span>
                    </div>
                    <div className="w-px h-3 bg-white/30" />
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-white/90" />
                      <span className="text-white/90 text-xs font-medium">{t("Fast delivery 24h")}</span>
                    </div>
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

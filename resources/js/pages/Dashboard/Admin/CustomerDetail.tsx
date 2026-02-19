"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, TrendingUp } from "lucide-react"
import AdminLayout from "../Layouts/admin-layout"
import { router } from "@inertiajs/react"

interface OrderItem {
  product_name: string
  quantity: number
  price: number
  subtotal: number
  image: string | null
}

interface Order {
  id: number
  order_number: string
  date: string
  status: string
  payment_status: string
  payment_method: string
  subtotal: number
  tax: number
  shipping_cost: number
  total: number
  shipping_address: string
  delivery_type: string
  notes: string | null
  items: OrderItem[]
}

interface CustomerDetail {
  id: string
  name: string
  email: string
  phone: string
  address: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  status: string
  avatar: string | null
  orders: Order[]
}

interface CustomerDetailPageProps {
  customer: CustomerDetail
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-200",
  confirmed: "bg-blue-500/10 text-blue-700 border-blue-200",
  shipped: "bg-purple-500/10 text-purple-700 border-purple-200",
  delivered: "bg-green-500/10 text-green-700 border-green-200",
  cancelled: "bg-red-500/10 text-red-700 border-red-200",
  completed: "bg-green-500/10 text-green-700 border-green-200",
}

const paymentStatusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-200",
  paid: "bg-green-500/10 text-green-700 border-green-200",
  failed: "bg-red-500/10 text-red-700 border-red-200",
  refunded: "bg-gray-500/10 text-gray-700 border-gray-200",
}

export default function CustomerDetailPage({ customer }: CustomerDetailPageProps) {
  const handleBack = () => {
    router.get('/admin/customers')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customer Details</h1>
            <p className="text-muted-foreground mt-1">View complete customer information and order history</p>
          </div>
        </div>
      </div>

      {/* Customer Info Card */}
      <Card className="border-border shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={customer.avatar || undefined} />
              <AvatarFallback className="text-2xl">
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{customer.name}</h2>
                <p className="text-muted-foreground">{customer.id}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined {customer.joinDate}</span>
                </div>
              </div>

              <div>
                <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                  {customer.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="border-border shadow-sm">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">{customer.totalOrders}</p>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">
                  ${customer.totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm sm:col-span-2 lg:col-span-1">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Average Order Value</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">
                  ${customer.averageOrderValue.toFixed(2)}
                </p>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order History */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Order History</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete order history for this customer ({customer.orders.length} orders)
          </p>
        </CardHeader>
        <CardContent>
          {customer.orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm">This customer hasn't placed any orders yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {customer.orders.map((order) => (
                <Card key={order.id} className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{order.order_number}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{order.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className={statusColors[order.status.toLowerCase()] || "bg-gray-500/10 text-gray-700 border-gray-200"}
                        >
                          {order.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={paymentStatusColors[order.payment_status.toLowerCase()] || "bg-gray-500/10 text-gray-700 border-gray-200"}
                        >
                          {order.payment_status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold mb-3">Items</h4>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.items.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    {item.image && (
                                      <img
                                        src={item.image}
                                        alt={item.product_name}
                                        className="h-10 w-10 rounded object-cover"
                                      />
                                    )}
                                    <span className="font-medium text-sm">{item.product_name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-semibold">
                                  ${item.subtotal.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <Separator />

                    {/* Order Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Shipping Address</p>
                        <p className="font-medium">{order.shipping_address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Delivery Type</p>
                        <p className="font-medium">{order.delivery_type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <p className="font-medium">{order.payment_method}</p>
                      </div>
                      {order.notes && (
                        <div>
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="font-medium">{order.notes}</p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Order Totals */}
                    <div className="flex justify-end">
                      <div className="w-full sm:w-64 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        {order.tax > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax</span>
                            <span>${order.tax.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Shipping</span>
                          <span>${order.shipping_cost.toFixed(2)}</span>
                        </div>
              <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

CustomerDetailPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

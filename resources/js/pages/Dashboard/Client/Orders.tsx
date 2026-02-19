"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Truck, CheckCircle, Clock, X } from "lucide-react"
import ClientLayout from "../Layouts/client-layout"
import { usePage } from "@inertiajs/react"
import { Order } from "@/types/order"

const statusConfig = {
  Delivered: { icon: CheckCircle, color: "bg-green-100 text-green-700 border-green-200" },
  Shipped: { icon: Truck, color: "bg-blue-100 text-blue-700 border-blue-200" },
  Canceled: { icon: X, color: "bg-red-100 text-blue-700 border-blue-200" },
  Processing: { icon: Clock, color: "bg-amber-100 text-amber-700 border-amber-200" },
  Pending: { icon: Package, color: "bg-gray-100 text-gray-700 border-gray-200" },
}

export default function OrdersPage() {

    const { orders } = usePage<{ orders: Order[] }>().props
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.product_name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Track and manage your orders</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon
          const statusColor = statusConfig[order.status as keyof typeof statusConfig].color

          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <CardDescription>Placed on {order.date}</CardDescription>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge variant="outline" className={statusColor}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {order.status}
                    </Badge>
                    <p className="text-lg font-bold text-primary">{order.total}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 border rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.product_name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{item.product_name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-primary text-sm sm:text-base flex-shrink-0">{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button variant="outline" className="flex-1 bg-transparent text-sm">
                    View Details
                  </Button>
                  {order.status === "Delivered" && (
                    <Button variant="outline" className="flex-1 bg-transparent text-sm">
                      Write Review
                    </Button>
                  )}
                  {order.status === "Shipped" && (
                    <Button variant="outline" className="flex-1 bg-transparent text-sm">
                      Track Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
OrdersPage.layout = (page: React.ReactNode) => <ClientLayout>{page}</ClientLayout>;

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react"
import ClientLayout from "../Layouts/client-layout"

const orders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "Delivered",
    total: "$129.99",
    items: [
      { name: "Wireless Headphones", quantity: 1, price: "$79.99", image: "/diverse-people-listening-headphones.png" },
      { name: "Phone Case", quantity: 2, price: "$25.00", image: "/colorful-phone-case-display.png" },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "Shipped",
    total: "$89.50",
    items: [{ name: "Smart Watch", quantity: 1, price: "$89.50", image: "/modern-smartwatch.png" }],
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "Processing",
    total: "$199.99",
    items: [
      { name: "Laptop Stand", quantity: 1, price: "$49.99", image: "/laptop-stand.png" },
      { name: "Mechanical Keyboard", quantity: 1, price: "$150.00", image: "/mechanical-keyboard.png" },
    ],
  },
  {
    id: "ORD-004",
    date: "2023-12-28",
    status: "Delivered",
    total: "$45.99",
    items: [{ name: "USB Cable", quantity: 3, price: "$45.99", image: "/usb-cable.png" }],
  },
]

const statusConfig = {
  Delivered: { icon: CheckCircle, color: "bg-green-100 text-green-700 border-green-200" },
  Shipped: { icon: Truck, color: "bg-blue-100 text-blue-700 border-blue-200" },
  Processing: { icon: Clock, color: "bg-amber-100 text-amber-700 border-amber-200" },
  Pending: { icon: Package, color: "bg-gray-100 text-gray-700 border-gray-200" },
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground mt-1">Track and manage your orders</p>
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
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-primary">{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    View Details
                  </Button>
                  {order.status === "Delivered" && (
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Write Review
                    </Button>
                  )}
                  {order.status === "Shipped" && (
                    <Button variant="outline" className="flex-1 bg-transparent">
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

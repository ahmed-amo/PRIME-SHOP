"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Truck, CheckCircle, Clock, X } from "lucide-react"
import ClientLayout from "../Layouts/client-layout"
import { Link, usePage } from "@inertiajs/react"
import { Order } from "@/types/order"
import { useI18n } from "@/lib/i18n"

const statusConfig = {
  delivered: { icon: CheckCircle, color: "bg-green-100 text-green-700 border-green-200" },
  shipped: { icon: Truck, color: "bg-blue-100 text-blue-700 border-blue-200" },
  cancelled: { icon: X, color: "bg-red-100 text-red-700 border-red-200" },
  processing: { icon: Clock, color: "bg-amber-100 text-amber-700 border-amber-200" },
  pending: { icon: Package, color: "bg-gray-100 text-gray-700 border-gray-200" },
}

export default function OrdersPage() {
  const { t, direction } = useI18n()
  const isRtl = direction === "rtl"

  const { orders } = usePage<{ orders: Order[] }>().props
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.product_name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div dir={direction} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("My Orders")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">{t("Track and manage your orders")}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRtl ? "right-3" : "left-3"}`} />
        <Input
          placeholder={t("Search orders...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={isRtl ? "pr-9 text-right" : "pl-9"}
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusKey = (order.status || "pending").toLowerCase() as keyof typeof statusConfig
          const config = statusConfig[statusKey] ?? statusConfig.pending
          const StatusIcon = config.icon
          const statusColor = config.color

          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <CardDescription>{order.date}</CardDescription>
                  </div>
                  <div className={`${isRtl ? "text-left" : "text-right"} space-y-2`}>
                    <Badge variant="outline" className={statusColor}>
                      <StatusIcon className={`h-3 w-3 ${isRtl ? "ml-1" : "mr-1"}`} />
                      {order.status}
                    </Badge>
                    <p className="text-lg font-bold text-primary">{order.total}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex flex-col gap-2 p-3 border rounded-lg">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.product_name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{item.product_name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{item.quantity}</p>
                        </div>
                        <p className="font-semibold text-primary text-sm sm:text-base flex-shrink-0">{item.price}</p>
                      </div>
                      {order.status.toLowerCase() === "delivered" && item.product_slug && (
                        <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent" asChild>
                          <Link href={`/product/${item.product_slug}#reviews`}>{t("Write Review")}</Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button variant="outline" className="flex-1 bg-transparent text-sm">
                    {t("View Details")}
                  </Button>
                  {order.status.toLowerCase() === "shipped" && (
                    <Button variant="outline" className="flex-1 bg-transparent text-sm">
                      {t("Track Order")}
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
            <p className="text-lg font-medium">{t("No orders found")}</p>
            <p className="text-sm text-muted-foreground">{t("Try adjusting your search")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

OrdersPage.layout = (page: React.ReactNode) => <ClientLayout>{page}</ClientLayout>;

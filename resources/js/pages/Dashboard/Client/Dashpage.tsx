import { ShoppingBag, Heart, Package, Clock, Link } from "lucide-react"
import StatsCard from "@/components/extra/adminStats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


const recentOrders = [
  { id: "ORD-001", date: "2024-01-15", status: "Delivered", total: "$129.99", items: 3 },
  { id: "ORD-002", date: "2024-01-10", status: "Shipped", total: "$89.50", items: 2 },
  { id: "ORD-003", date: "2024-01-05", status: "Processing", total: "$199.99", items: 5 },
]

const recentlyViewed = [
  { id: 1, name: "Wireless Headphones", price: "$79.99", image: "/diverse-people-listening-headphones.png" },
  { id: 2, name: "Smart Watch", price: "$299.99", image: "/modern-smartwatch.png" },
  { id: 3, name: "Laptop Stand", price: "$49.99", image: "/laptop-stand.png" },
]

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, John!</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your account</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Orders" value="24" icon={ShoppingBag} iconColor="primary" />
        <StatsCard title="Wishlist Items" value="12" icon={Heart} iconColor="accent" />
        <StatsCard title="Active Orders" value="3" icon={Package} iconColor="success" />
        <StatsCard title="Pending Reviews" value="5" icon={Clock} iconColor="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest purchases</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/client/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-primary">{order.total}</p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recently Viewed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recently Viewed</CardTitle>
              <CardDescription>Products you've checked out</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/client/wishlist">View Wishlist</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentlyViewed.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-primary font-semibold mt-1">{product.price}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

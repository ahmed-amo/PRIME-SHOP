"use client"

import StatsCard from "@/components/extra/adminStats"
import { Package, DollarSign, Users, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import AdminLayout from "@/pages/Dashboard/Layouts/admin-layout";


const recentOrders = [
  { id: "#ORD-001", customer: "John Doe", product: "Wireless Headphones", amount: "$129.99", status: "completed" },
  { id: "#ORD-002", customer: "Jane Smith", product: "Smart Watch", amount: "$299.99", status: "processing" },
  { id: "#ORD-003", customer: "Bob Johnson", product: "Laptop Stand", amount: "$49.99", status: "completed" },
  { id: "#ORD-004", customer: "Alice Brown", product: "USB-C Cable", amount: "$19.99", status: "pending" },
  { id: "#ORD-005", customer: "Charlie Wilson", product: "Keyboard", amount: "$89.99", status: "completed" },
]

const statusColors = {
  completed: "bg-green-500/10 text-green-700 border-green-200",
  processing: "bg-accent/10 text-accent border-accent/20",
  pending: "bg-amber-500/10 text-amber-700 border-amber-200",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground text-balance">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value="1,234"
          icon={Package}
          iconColor="primary"
          trend={{ value: "12% from last month", isPositive: true }}
        />
        <StatsCard
          title="Total Revenue"
          value="$45,231"
          icon={DollarSign}
          iconColor="success"
          trend={{ value: "8% from last month", isPositive: true }}
        />
        <StatsCard
          title="Total Clients"
          value="892"
          icon={Users}
          iconColor="accent"
          trend={{ value: "3% from last month", isPositive: false }}
        />
        <StatsCard
          title="Total Orders"
          value="2,345"
          icon={ShoppingCart}
          iconColor="warning"
          trend={{ value: "15% from last month", isPositive: true }}
        />
      </div>

      {/* Sales chart */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Sales Overview</CardTitle>
          <p className="text-sm text-muted-foreground">Monthly sales performance for the year</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">

          </div>
        </CardContent>
      </Card>

      {/* Recent orders */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Orders</CardTitle>
          <p className="text-sm text-muted-foreground">Latest orders from your customers</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="border-border">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell className="font-semibold">{order.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[order.status as keyof typeof statusColors]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
DashboardPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

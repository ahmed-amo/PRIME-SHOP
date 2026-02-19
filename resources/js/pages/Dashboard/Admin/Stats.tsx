"use client"

import StatsCard from "@/components/extra/adminStats"
import { DollarSign, Users, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AdminLayout from "@/pages/Dashboard/Layouts/admin-layout"

interface Stats {
  totalCustomers: number
  totalOrders: number
  totalRevenue: number
  activeCustomers?: number
  inactiveCustomers?: number
  topCustomers?: Array<{
    name: string
    totalSpent: number
    totalOrders: number
  }>
  monthlyRegistrations?: Array<{
    month: string
    count: number
  }>
}

interface StatsPageProps {
  stats: Stats
}

export default function DashboardPage({ stats }: StatsPageProps) {

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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
          iconColor="accent"
          trend={{
            value: stats.activeCustomers
              ? `${stats.activeCustomers} active customers`
              : "No activity data",
            isPositive: true,
          }}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          iconColor="success"
          trend={{
            value: stats.totalOrders > 0
              ? `From ${stats.totalOrders} orders`
              : "No orders yet",
            isPositive: true,
          }}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          iconColor="warning"
          trend={{
            value: stats.totalCustomers > 0
              ? `Avg: $${(stats.totalRevenue / stats.totalOrders).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per order`
              : "No data available",
            isPositive: true,
          }}
        />
        <StatsCard
          title="Active Customers"
          value={stats.activeCustomers?.toLocaleString() || "0"}
          icon={Users}
          iconColor="primary"
          trend={{
            value: stats.inactiveCustomers
              ? `${stats.inactiveCustomers} inactive`
              : "All customers active",
            isPositive: (stats.activeCustomers || 0) > (stats.inactiveCustomers || 0),
          }}
        />
      </div>

      {/* Top Customers */}
      {stats.topCustomers && stats.topCustomers.length > 0 && (
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Top Customers</CardTitle>
            <p className="text-sm text-muted-foreground">Your best customers by total spending</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Customer</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.topCustomers.map((customer, index) => (
                  <TableRow key={index} className="border-border">
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ${customer.totalSpent.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Sales chart placeholder */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Sales Overview</CardTitle>
          <p className="text-sm text-muted-foreground">Monthly sales performance for the year</p>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            {stats.monthlyRegistrations && stats.monthlyRegistrations.length > 0 ? (
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Monthly Customer Registrations</p>
                <div className="space-y-2">
                  {stats.monthlyRegistrations.map((reg, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                      <span className="text-sm">{reg.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(reg.count / Math.max(...stats.monthlyRegistrations!.map((r) => r.count))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{reg.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No registration data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

DashboardPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

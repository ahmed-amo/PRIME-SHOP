"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Mail, Phone, ShoppingBag, Users, DollarSign, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import AdminLayout from "../Layouts/admin-layout"
import { router } from "@inertiajs/react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  status: string
  avatar: string | null
}

interface Stats {
  totalCustomers: number
  totalOrders: number
  totalRevenue: number
}

interface CustomersPageProps {
  customers: Customer[]
  stats: Stats
}

export default function CustomersPage({ customers, stats }: CustomersPageProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCustomers = customers.filter((customer) => {
    const q = searchQuery.toLowerCase()
    return (
      customer.id.toLowerCase().includes(q) ||
      customer.name.toLowerCase().includes(q) ||
      customer.email.toLowerCase().includes(q) ||
      customer.phone.includes(searchQuery)
    )
  })

  const handleCustomerClick = (customer: Customer) => {
    const numericId = customer.id.replace("CUST-", "").replace(/^0+/, "")
    router.get(`/admin/customers/${numericId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground mt-2">View and manage registered customers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-900 border-2 border-blue-100 dark:border-blue-900 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalCustomers}
              </p>
            </div>
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Users className="h-5 w-5 md:h-7 md:w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border-2 border-green-100 dark:border-green-900 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalOrders}
              </p>
            </div>
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 md:h-7 md:w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border-2 border-orange-100 dark:border-orange-900 rounded-xl p-4 md:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <DollarSign className="h-5 w-5 md:h-7 md:w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer ID, name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        />
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No customers found</p>
            <p className="text-sm">Try adjusting your search</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <Card
              key={customer.id}
              onClick={() => handleCustomerClick(customer)}
              className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30 border-2 border-gray-200 dark:border-gray-800"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={customer.avatar || undefined} />
                      <AvatarFallback>
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.id}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <span className="text-xs text-muted-foreground">Join Date: </span>
                      <span className="text-xs">{customer.joinDate}</span>
                    </div>
                    <Badge variant={customer.status === "active" ? "default" : "secondary"} className="text-xs">
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Orders: </span>
                      <span className="font-bold">{customer.totalOrders}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Spent: </span>
                      <span className="font-bold text-orange-600">${customer.totalSpent.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block border-2 border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No customers found</p>
                    <p className="text-sm">Try adjusting your search</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    onClick={() => handleCustomerClick(customer)}
                    className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={customer.avatar || undefined} />
                          <AvatarFallback>
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.id}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{customer.joinDate}</TableCell>

                    <TableCell>
                      <span className="font-bold">{customer.totalOrders}</span>
                    </TableCell>

                    <TableCell>
                      <span className="font-bold text-orange-600">
                        ${customer.totalSpent.toFixed(2)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                        {customer.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

CustomersPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

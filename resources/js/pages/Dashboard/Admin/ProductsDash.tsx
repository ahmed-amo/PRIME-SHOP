"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, Eye, Link } from "lucide-react"
import AdminLayout from "../Layouts/admin-layout"

// Mock data
const mockProducts = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 129.99, stock: 45, status: "active" },
  { id: 2, name: "Smart Watch", category: "Electronics", price: 299.99, stock: 23, status: "active" },
  { id: 3, name: "Laptop Stand", category: "Accessories", price: 49.99, stock: 67, status: "active" },
  { id: 4, name: "USB-C Cable", category: "Accessories", price: 19.99, stock: 120, status: "active" },
  { id: 5, name: "Mechanical Keyboard", category: "Electronics", price: 89.99, stock: 34, status: "active" },
  { id: 6, name: "Mouse Pad", category: "Accessories", price: 14.99, stock: 89, status: "active" },
  { id: 7, name: "Webcam HD", category: "Electronics", price: 79.99, stock: 12, status: "low stock" },
  { id: 8, name: "Phone Case", category: "Accessories", price: 24.99, stock: 0, status: "out of stock" },
]

const statusColors = {
  active: "bg-green-500/10 text-green-700 border-green-200",
  "low stock": "bg-amber-500/10 text-amber-700 border-amber-200",
  "out of stock": "bg-red-500/10 text-red-700 border-red-200",
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products] = useState(mockProducts)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your product inventory and pricing</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search and filters */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products table */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">All Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-border">
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="font-semibold">${product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[product.status as keyof typeof statusColors]}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
ProductsPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

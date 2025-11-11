"use client"

import { useEffect, useState } from "react"
import { router, usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, Eye, RefreshCw } from "lucide-react"
import AdminLayout from "../Layouts/admin-layout"
import { Link } from "@inertiajs/react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle } from "lucide-react"

interface Product {
  id: number
  name: string
  category: string | null
  price: number
  stock: number
  status: "active" | "low stock" | "out of stock"
  sku: string
  image_url: string | null
}

interface PaginatedProducts {
  data: Product[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: {
    prev?: string | null
    next?: string | null
  }
}

interface Props {
  products: PaginatedProducts
}

const statusBadge = {
  active: "bg-green-500/10 text-green-700 border border-green-200",
  "low stock": "bg-amber-500/10 text-amber-700 border border-amber-200",
  "out of stock": "bg-red-500/10 text-red-700 border border-red-200",
}

export default function ProductsDash({ products }: Props) {
  const { flash} = usePage<{ flash?: { success?: string }, errors?: Record<string, string> }>().props

  const [flashMessage, setFlashMessage] = useState(flash?.success || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  // Auto-hide flash
  useEffect(() => {
    if (flashMessage) {
      const t = setTimeout(() => setFlashMessage(""), 4000)
      return () => clearTimeout(t)
    }
  }, [flashMessage])

  // Delete with loading + feedback
  const handleDelete = (id: number) => {
    if (!confirm("Delete this product forever?")) return

    setIsDeleting(id)
    router.delete(route('admin.products.destroy', id), {
      onSuccess: () => {
        setFlashMessage("Product deleted successfully")
      },
      onError: () => {
        setFlashMessage("Failed to delete product")
      },
      onFinish: () => {
        setIsDeleting(null)
      }
    })
  }

  // Filter live
  const filtered = products.data.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Flash Message */}
      {flashMessage && (
        <Alert className={flashMessage.includes("deleted") || flashMessage.includes("success") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertDescription className="flex items-center gap-2">
            {flashMessage.includes("deleted") || flashMessage.includes("success") ? (
              <span className="text-green-700 text-center">{flashMessage}</span>
            ) : (
              <><XCircle className="h-4 w-4" /> <span className="text-red-700">{flashMessage}</span></>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">Manage inventory, pricing, and availability</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU, category..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => router.reload({ only: ['products'] })}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Link href={route('admin.products.create')}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({filtered.length} of {products.total})</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              {searchQuery ? "No products match your search." : "No products yet. Click 'Add Product' to get started!"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg border"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-image.jpg" // fallback
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-xs">
                            <span className="text-muted-foreground">No image</span>
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{product.sku || "-"}</TableCell>
                      <TableCell>{product.category || "-"}</TableCell>
                      <TableCell className="font-semibold">{product.price.toFixed(2)} DZD</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusBadge[product.status]}>
                          {product.status === "active" ? "Active" : product.status === "low stock" ? "Low Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/products/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                            disabled={isDeleting === product.id}
                          >
                            {isDeleting === product.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin text-destructive" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination - Using Laravel's links */}
      {products.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {products.current_page} of {products.last_page} ({products.total} total)
          </p>
          <div className="flex gap-2">
            {products.links.prev && (
              <Link href={products.links.prev}>
                <Button variant="outline" size="sm">Previous</Button>
              </Link>
            )}
            {products.links.next && (
              <Link href={products.links.next}>
                <Button variant="outline" size="sm">Next</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

ProductsDash.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

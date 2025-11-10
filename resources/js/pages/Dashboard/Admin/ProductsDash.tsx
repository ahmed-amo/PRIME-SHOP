import { useState } from "react"
import { router } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react"
import AdminLayout from "../Layouts/admin-layout"
import { Link } from "@inertiajs/react"

interface Product {
  id: number
  name: string
  category: string | null
  price: number
  stock: number
  status: string
  sku: string
  image_url: string | null
}

interface PaginatedProducts {
  data: Product[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface Props {
  products: PaginatedProducts
}

const statusColors = {
  active: "bg-green-500/10 text-green-700 border-green-200",
  "low stock": "bg-amber-500/10 text-amber-700 border-amber-200",
  "out of stock": "bg-red-500/10 text-red-700 border-red-200",
}

export default function ProductsDash({ products }: Props) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleDelete = (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
        router.delete(`/admin/products/${productId}`, {
          onSuccess: () => {
            setSearchQuery("")
            console.log('Product deleted successfully')
          }
      })
    }
  }

  // Filter products based on search
  const filteredProducts = products.data.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Page header with search */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your product inventory and pricing</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Link href="/admin/products/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Products table */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">All Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "No products found matching your search." : "No products yet. Add your first product!"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
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
                    <TableCell>
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku || '-'}</TableCell>
                    <TableCell>{product.category || '-'}</TableCell>
                    <TableCell className="font-semibold">${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[product.status as keyof typeof statusColors]}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {products.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {products.data.length} of {products.total} products
          </p>
          <div className="flex gap-2">
            {products.current_page > 1 && (
              <Link href={`/admin/products?page=${products.current_page - 1}`}>
                <Button variant="outline" size="sm">Previous</Button>
              </Link>
            )}
            {products.current_page < products.last_page && (
              <Link href={`/admin/products?page=${products.current_page + 1}`}>
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

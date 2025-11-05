import { router, Link, Head } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react"
import AdminLayout from "../Layouts/admin-layout"

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
  total: number
  links: Array<{ url: string | null; label: string; active: boolean }>
}

interface Props {
  products: PaginatedProducts
  filters: { search?: string }
}

export default function ProductsDash({ products, filters }: Props) {
  const search = filters.search ?? ""

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    router.delete(`/admin/products/${id}`)
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      "in stock": "bg-green-500/10 text-green-700 border-green-200",
      "low stock": "bg-amber-500/10 text-amber-700 border-amber-200",
      "out of stock": "bg-red-500/10 text-red-700 border-red-200",
    }
    return map[status.toLowerCase()] || "bg-muted text-muted-foreground"
  }

  return (
    <>
      <Head title="Products" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-sm text-muted-foreground">Manage your product inventory</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Server-side Search */}
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              router.get('/admin/products', formData, { preserveState: true })
            }}>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  type="search"
                  placeholder="Search products..."
                  defaultValue={search}
                  className="pl-9"
                />
              </div>
            </form>

            <Link href="/admin/products/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Products ({products.total})</CardTitle>
          </CardHeader>
          <CardContent>
            {products.data.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">
                {search ? "No products found." : "No products yet."}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.data.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs">
                            No img
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-muted-foreground">{product.sku || "-"}</TableCell>
                      <TableCell>{product.category || "-"}</TableCell>
                      <TableCell className="font-semibold">${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(product.status)}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
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

        {/* Inertia Pagination */}
        {products.links?.length > 3 && (
          <nav className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {products.data.length} of {products.total}
            </p>
            <div className="flex gap-1">
              {products.links.map((link, i) => {
                if (!link.url) return null
                const isActive = link.active
                const isPrevNext = link.label.includes("Previous") || link.label.includes("Next")
                const label = isPrevNext ? link.label : link.label.replace(/&laquo;|&raquo;/g, "")

                return (
                  <Link
                    key={i}
                    href={link.url}
                    preserveScroll
                    className={`px-3 py-1 text-sm rounded border ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </div>
    </>
  )
}

ProductsDash.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

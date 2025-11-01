"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Pencil, Trash2 } from "lucide-react"
import AdminLayout from "../Layouts/admin-layout"
import { Link, router } from "@inertiajs/react"

interface Category {
  id: number
  name: string
  slug: string
  description?: string | null
  status?: boolean
  products_count?: number
}

interface Paginated<T> {
  data: T[]
  links: { url: string | null; label: string; active: boolean }[]
  meta?: any
}

export default function CategoriesPage({ categories }: { categories: Paginated<Category> }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = useMemo(() => {
    const source = categories?.data ?? []
    if (!searchQuery) return source
    const q = searchQuery.toLowerCase()
    return source.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
  }, [categories, searchQuery])

  const onDelete = (id: number) => {
    if (!confirm("Delete this category?")) return
    router.delete(route('admin.categories.destroy', { category: id }))
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">Organize your products into categories</p>
        </div>
        <Link href="/admin/categories/add">
          <Button className="gap-2">
            Add Category
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories table */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">All Categories ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Category Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((category) => (
                <TableRow key={category.id} className="border-border">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell>{category.products_count ?? 0} products</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${category.status ? 'bg-green-500/10 text-green-700 border-green-200' : 'bg-gray-200 text-gray-700 border-gray-300'}`}>
                      {category.status ? 'active' : 'inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(category.id)}>
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
CategoriesPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

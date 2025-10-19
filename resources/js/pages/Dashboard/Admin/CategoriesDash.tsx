"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Pencil, Trash2 } from "lucide-react"
import AdminLayout from "../Layouts/admin-layout"
import {Link} from "@inertiajs/react"

// Mock data
const mockCategories = [
  { id: 1, name: "Electronics", slug: "electronics", productCount: 156, status: "active" },
  { id: 2, name: "Accessories", slug: "accessories", productCount: 89, status: "active" },
  { id: 3, name: "Clothing", slug: "clothing", productCount: 234, status: "active" },
  { id: 4, name: "Home & Garden", slug: "home-garden", productCount: 67, status: "active" },
  { id: 5, name: "Sports", slug: "sports", productCount: 45, status: "active" },
  { id: 6, name: "Books", slug: "books", productCount: 123, status: "active" },
]

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categories] = useState(mockCategories)

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          <CardTitle className="text-foreground">All Categories ({filteredCategories.length})</CardTitle>
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
              {filteredCategories.map((category) => (
                <TableRow key={category.id} className="border-border">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell>{category.productCount} products</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
                      {category.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/categories/${category.id}/edit`}>
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
CategoriesPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

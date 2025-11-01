"use client"

import type React from "react"

import { useForm } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import {Link} from "@inertiajs/react"
import AdminLayout from "../Layouts/admin-layout"

type CategoryForm = {
  id: number
  name: string
  slug: string
  description?: string | null
}

export default function EditCategoryPage({ category }: { category: CategoryForm }) {
  const { data, setData, put, processing } = useForm<CategoryForm>({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
  })

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    setData({ ...data, name, slug })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(route('admin.categories.update', { category: data.id }))
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/categories">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Edit Category</h1>
          <p className="mt-1 text-sm text-muted-foreground">Update category information</p>
        </div>
      </div>

      {/* Category form */}
      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  value={data.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="category-slug"
                  value={data.slug}
                  onChange={(e) => setData({ ...data, slug: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly version of the name. Auto-generated from name.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter category description"
                  value={data.description ?? ''}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button type="submit" disabled={processing}>Update Category</Button>
              <Link href="/admin/categories">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
EditCategoryPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

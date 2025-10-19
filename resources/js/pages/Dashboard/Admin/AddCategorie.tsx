"use client"

import type React from "react"

import { router } from '@inertiajs/react';
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Link} from "lucide-react"
import AdminLayout from "../Layouts/admin-layout";


export default function NewCategoryPage() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  })

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    setFormData({ ...formData, name, slug })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Category created:", formData)
    // In a real app, this would save to database
    router.visit("/admin/categories")
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
          <h1 className="text-3xl font-bold text-foreground text-balance">Add New Category</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create a new category for your products</p>
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
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="category-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              <Button type="submit">Create Category</Button>
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
NewCategoryPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

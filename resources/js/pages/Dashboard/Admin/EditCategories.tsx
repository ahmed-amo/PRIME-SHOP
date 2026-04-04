"use client"

import type React from "react"

import { router, usePage } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, X, AlertCircle } from "lucide-react"
import AdminLayout from "../Layouts/admin-layout";
import { Link } from "@inertiajs/react";
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  color: string | null
  status: boolean
  image: string | null
}

interface PageProps {
    category: Category
    errors: Record<string, string>
    [key: string]: unknown
  }

export default function EditCategoryPage() {
  const { category, errors } = usePage<PageProps>().props
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "",
    status: true,
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        color: category.color || "#000000",
        status: category.status,
        image: null,
      })
      if (category.image) {
        setImagePreview(category.image)
      }
    }
  }, [category])

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    setFormData({ ...formData, name, slug })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, image: null })
    setImagePreview(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const submitData = new FormData()
    submitData.append('name', formData.name)
    submitData.append('slug', formData.slug)
    submitData.append('description', formData.description || '')
    submitData.append('color', formData.color || '')
    submitData.append('status', formData.status ? '1' : '0')
    submitData.append('_method', 'PUT')

    if (formData.image) {
      submitData.append('image', formData.image)
    }

    router.post(`/admin/categories/${category.id}`, submitData, {
      forceFormData: true,
      onSuccess: () => {
        // Optionally show success message
      },
      onError: (errors) => {
        console.log('Validation Errors:', errors)
      },
      onFinish: () => {
        setIsSubmitting(false)
      },
    })
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

      {/* Error Messages */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Category form */}
      <form onSubmit={handleSubmit}>
        <div className="flex gap-6">
          {/* Left side - Category Information */}
          <div className="flex-1 space-y-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Category Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter category name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    placeholder="category-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className={errors.slug ? "border-red-500" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    URL-friendly version of the name. Auto-generated from name.
                  </p>
                  {errors.slug && (
                    <p className="text-xs text-red-500">{errors.slug}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter category description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className={errors.color ? "border-red-500 h-10" : "h-10"}
                  />
                  {errors.color && (
                    <p className="text-xs text-red-500">{errors.color}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Image Upload and Actions */}
          <div className="w-80 space-y-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Category Image</CardTitle>
              </CardHeader>
              <CardContent>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div className="text-muted-foreground text-sm">Drag and drop or click to upload</div>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Label htmlFor="image">
                        <Button variant="outline" size="sm" type="button" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                    </div>
                  </div>
                )}
                {errors.image && (
                  <p className="text-xs text-red-500 mt-2">{errors.image}</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Category"}
                </Button>
                <Link href="/admin/categories">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

EditCategoryPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

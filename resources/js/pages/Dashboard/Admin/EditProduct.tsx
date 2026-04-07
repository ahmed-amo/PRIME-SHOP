"use client"

import { useState, FormEvent, useEffect } from "react"
import { router, usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X, AlertCircle } from "lucide-react"
import { Link } from '@inertiajs/react'
import AdminLayout from "../Layouts/admin-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDA } from "@/lib/currency"

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
  category_id: number | null
  price: number
  compare_at_price?: number | null
  sale_enabled?: boolean
  sale_price?: number | null
  sale_starts_at?: string | null
  sale_ends_at?: string | null
  stock: number
  description: string
  sku: string
  status: "active" | "low stock" | "out of stock"
  image_url: string | null
  gallery_images?: string[]
  hero_sort_order?: number | null
}

interface Props {
  product: Product
  categories: Category[]
  errors: Record<string, string>
}

export default function EditProduct({ product: initialProduct, categories, errors }: Props) {
  const { flash } = usePage<{ flash?: { success?: string } }>().props

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    stock: "",
    description: "",
    sku: "",
    status: "active" as "active" | "low stock" | "out of stock",
    sale_enabled: false,
    sale_price: "",
    sale_starts_at: "",
    sale_ends_at: "",
    hero_sort_order: "",
  })

  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<File[]>([])
  const [replaceGallery, setReplaceGallery] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [flashMessage, setFlashMessage] = useState(flash?.success || "")

  // Load initial data
  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || "",
        category_id: initialProduct.category_id?.toString() || "",
        price: initialProduct.price.toString(),
        stock: initialProduct.stock.toString(),
        description: initialProduct.description || "",
        sku: initialProduct.sku || "",
        status: initialProduct.status || "active",
        sale_enabled: Boolean(initialProduct.sale_enabled),
        sale_price:
          initialProduct.sale_price != null && initialProduct.sale_price !== undefined
            ? String(initialProduct.sale_price)
            : "",
        sale_starts_at: initialProduct.sale_starts_at || "",
        sale_ends_at: initialProduct.sale_ends_at || "",
        hero_sort_order:
          initialProduct.hero_sort_order != null && initialProduct.hero_sort_order !== undefined
            ? String(initialProduct.hero_sort_order)
            : "",
      })
      if (initialProduct.image_url) {
        setImagePreview(initialProduct.image_url)
      }
    }
  }, [initialProduct])

  // Auto-hide flash
  useEffect(() => {
    if (flashMessage) {
      const t = setTimeout(() => setFlashMessage(""), 4000)
      return () => clearTimeout(t)
    }
  }, [flashMessage])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(initialProduct.image_url || null)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const data = new FormData()
    data.append('name', formData.name)
    data.append('category_id', formData.category_id)
    data.append('price', formData.price)
    data.append('stock', formData.stock)
    data.append('description', formData.description)
    data.append('sku', formData.sku)
    data.append('_method', 'PUT')
    data.append('sale_enabled', formData.sale_enabled ? '1' : '0')
    if (formData.sale_price.trim() !== "") {
      data.append('sale_price', formData.sale_price)
    }
    if (formData.sale_starts_at.trim() !== "") {
      data.append('sale_starts_at', formData.sale_starts_at)
    }
    if (formData.sale_ends_at.trim() !== "") {
      data.append('sale_ends_at', formData.sale_ends_at)
    }

    data.append(
      'hero_sort_order',
      formData.hero_sort_order.trim() !== '' ? formData.hero_sort_order.trim() : ''
    )

    if (image) {
      data.append('image', image)
    }
    if (galleryImages.length > 0) {
      data.append('replace_gallery', replaceGallery ? '1' : '0')
      galleryImages.slice(0, 5).forEach((file) => data.append('gallery_images[]', file))
    }

    router.post(`/admin/products/${initialProduct.id}`, data, {
      forceFormData: true,
      onSuccess: () => {
        setFlashMessage("Product updated successfully!")
      },
      onError: () => {},
      onFinish: () => {
        setIsSubmitting(false)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Flash Message */}
      {flashMessage && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">
            {flashMessage}
          </AlertDescription>
        </Alert>
      )}

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

      {/* Page header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Edit Product</h1>
          <p className="mt-1 text-sm text-muted-foreground">Update product details and inventory</p>
        </div>
      </div>

      {/* Product form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className={errors.name ? "border-red-500" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="e.g., PROD-001"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories && categories.length > 0 ? (
                          categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No categories available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>


              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (DA) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Sales &amp; pricing</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Scheduled sale uses your regular price as the original amount and charges the sale price at checkout.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sale_enabled"
                    checked={formData.sale_enabled}
                    onCheckedChange={(v) =>
                      setFormData({ ...formData, sale_enabled: Boolean(v) })
                    }
                  />
                  <Label htmlFor="sale_enabled" className="cursor-pointer">
                    Enable scheduled sale
                  </Label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Original (regular) price</Label>
                    <Input value={formData.price} readOnly className="bg-muted" aria-readonly />
                    <p className="text-xs text-muted-foreground">Same as &quot;Price (DA)&quot; above — shown struck through during sale.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale_price">Sale price (DA)</Label>
                    <Input
                      id="sale_price"
                      type="number"
                      step="1"
                      min="0"
                      placeholder="Discounted price (DA)"
                      value={formData.sale_price}
                      onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                      disabled={!formData.sale_enabled}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sale_starts_at">Sale start (optional)</Label>
                    <Input
                      id="sale_starts_at"
                      type="datetime-local"
                      value={formData.sale_starts_at}
                      onChange={(e) => setFormData({ ...formData, sale_starts_at: e.target.value })}
                      disabled={!formData.sale_enabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale_ends_at">Sale end (optional)</Label>
                    <Input
                      id="sale_ends_at"
                      type="datetime-local"
                      value={formData.sale_ends_at}
                      onChange={(e) => setFormData({ ...formData, sale_ends_at: e.target.value })}
                      disabled={!formData.sale_enabled}
                    />
                  </div>
                </div>

                {formData.sale_enabled && formData.sale_price && parseFloat(formData.sale_price) > 0 && (
                  <div className="rounded-lg border border-dashed border-orange-300 bg-orange-50/60 p-4 dark:border-orange-900 dark:bg-orange-950/30">
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-800 dark:text-orange-200">
                      Storefront preview
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-muted-foreground line-through">
                        {formatDA(parseFloat(formData.price) || 0)}
                      </span>
                      <span className="text-lg font-bold text-orange-700 dark:text-orange-300">
                        {formatDA(parseFloat(formData.sale_price) || 0)}
                      </span>
                      {parseFloat(formData.price) > 0 && (
                        <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                          -
                          {Math.round(
                            ((parseFloat(formData.price) - parseFloat(formData.sale_price)) /
                              parseFloat(formData.price)) *
                              100
                          )}
                          %
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Home page hero</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Featured products appear in the top carousel on the shop home. Lower numbers show first
                  (e.g. 1, then 2). Leave empty to remove this product from the hero.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="hero_sort_order">Hero order (optional)</Label>
                  <Input
                    id="hero_sort_order"
                    type="number"
                    min={1}
                    max={30}
                    placeholder="e.g. 1 for first slide"
                    value={formData.hero_sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, hero_sort_order: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Uses this product&apos;s image (blurred background style is unchanged on the storefront).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Product Gallery (max 5)</CardTitle>
              </CardHeader>
              <CardContent>
                {(initialProduct.gallery_images?.length ?? 0) > 0 ? (
                  <div className="mb-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">Current gallery</p>
                    <div className="grid grid-cols-5 gap-2">
                      {initialProduct.gallery_images?.slice(0, 5).map((url) => (
                        <img key={url} src={url} alt="" className="h-16 w-full rounded-md border object-cover" />
                      ))}
                    </div>
                  </div>
                ) : null}

                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-64 object-cover rounded-lg border"
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
                      <div className="text-muted-foreground text-sm">
                        Drag and drop or click to upload
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label htmlFor="image-upload">
                        <Button variant="outline" size="sm" type="button" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                    </div>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <Label htmlFor="gallery-upload">New gallery images</Label>
                  <Input
                    id="gallery-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setGalleryImages(Array.from(e.target.files ?? []).slice(0, 5))}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      id="replace_gallery"
                      type="checkbox"
                      checked={replaceGallery}
                      onChange={(e) => setReplaceGallery(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="replace_gallery">Replace existing gallery</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Product"}
                </Button>
                <Link href="/admin/products" className="block">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
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

EditProduct.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

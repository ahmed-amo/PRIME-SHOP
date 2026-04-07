import { useState, FormEvent } from "react"
import { router } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { Link } from '@inertiajs/react'
import AdminLayout from "../Layouts/admin-layout"

interface Category {
  id: number
  name: string
}

interface Props {
  categories: Category[]
}

export default function AddProduct({ categories }: Props) {

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    stock: "",
    description: "",
    sku: "",
    hero_sort_order: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [galleryImages, setGalleryImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    data.append(
      'hero_sort_order',
      formData.hero_sort_order.trim() !== '' ? formData.hero_sort_order.trim() : ''
    )
    if (image) {
      data.append('image', image)
    }
    galleryImages.slice(0, 5).forEach((file) => data.append('gallery_images[]', file))

    router.post(route('admin.products.store'), data, {
      onSuccess: () => {
        console.log('Product created successfully')
      },
      onError: (errors) => {
        console.error('Validation errors:', errors)
        setIsSubmitting(false)
      },
      onFinish: () => {
        setIsSubmitting(false)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Add New Product</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create a new product in your inventory</p>
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
                <CardTitle className="text-foreground">Home page hero</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Optional: set order (1 = first slide) to feature this product in the shop home carousel.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="hero_sort_order">Hero order (optional)</Label>
                  <Input
                    id="hero_sort_order"
                    type="number"
                    min={1}
                    max={30}
                    placeholder="e.g. 1"
                    value={formData.hero_sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, hero_sort_order: e.target.value })
                    }
                  />
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
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <div className="space-y-2">
                    <div className="text-muted-foreground text-sm">
                      {galleryImages.length > 0
                        ? `${galleryImages.length} file(s) selected`
                        : image
                        ? image.name
                        : "Drag and drop or click to upload"}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setGalleryImages(Array.from(e.target.files ?? []).slice(0, 5))}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <Label htmlFor="gallery-upload">
                      <Button variant="outline" size="sm" type="button" asChild>
                        <span>Choose File</span>
                      </Button>
                    </Label>
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Optional: you can still upload a legacy single image below.
                </div>
                <div className="mt-3">
                  <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Product"}
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

AddProduct.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

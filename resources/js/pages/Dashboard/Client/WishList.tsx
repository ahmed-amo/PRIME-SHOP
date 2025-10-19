"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, ShoppingCart, Trash2 } from "lucide-react"
import ClientLayout from "../Layouts/client-layout"

const wishlistItems = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    price: "$199.99",
    originalPrice: "$249.99",
    discount: "20% OFF",
    image: "/premium-headphones.png",
    inStock: true,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: "Smart Watch Ultra",
    price: "$399.99",
    originalPrice: null,
    discount: null,
    image: "/premium-smartwatch.jpg",
    inStock: true,
    rating: 4.8,
    reviews: 256,
  },
  {
    id: 3,
    name: "Mechanical Keyboard RGB",
    price: "$149.99",
    originalPrice: "$179.99",
    discount: "15% OFF",
    image: "/mechanical-keyboard.png",
    inStock: false,
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 4,
    name: "4K Webcam",
    price: "$129.99",
    originalPrice: null,
    discount: null,
    image: "/classic-webcam.png",
    inStock: true,
    rating: 4.3,
    reviews: 64,
  },
  {
    id: 5,
    name: "Laptop Stand Aluminum",
    price: "$49.99",
    originalPrice: "$69.99",
    discount: "30% OFF",
    image: "/laptop-stand-aluminum.jpg",
    inStock: true,
    rating: 4.7,
    reviews: 142,
  },
  {
    id: 6,
    name: "Wireless Mouse",
    price: "$39.99",
    originalPrice: null,
    discount: null,
    image: "/wireless-mouse.png",
    inStock: true,
    rating: 4.4,
    reviews: 98,
  },
]

export default function WishlistPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [items, setItems] = useState(wishlistItems)

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleRemove = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">{items.length} items saved for later</p>
        </div>
        <Button variant="outline">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add All to Cart
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search wishlist..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Wishlist Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden group">
            <div className="relative">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
              {item.discount && (
                <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">{item.discount}</Badge>
              )}
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {!item.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="secondary">Out of Stock</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground line-clamp-2">{item.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <span className="text-sm text-amber-500">★</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {item.rating} ({item.reviews})
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">{item.price}</span>
                {item.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">{item.originalPrice}</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" disabled={!item.inStock}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button size="icon" variant="outline" onClick={() => handleRemove(item.id)}>
                  <Heart className="h-4 w-4 fill-current text-primary" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No items in wishlist</p>
            <p className="text-sm text-muted-foreground">Start adding products you love</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
WishlistPage.layout = (page: React.ReactNode) => <ClientLayout>{page}</ClientLayout>;

"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, ShoppingCart, Trash2 } from "lucide-react"
import ClientLayout from "../Layouts/client-layout"
import AddToCartButton from "@/components/AddToCartButton"
import { useWishlist } from "@/contexts/wishlistContext"
import { useCart } from "@/contexts/cartContext"

export default function WishlistPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  const filteredItems = useMemo(() => {
    return wishlistItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [wishlistItems, searchQuery])

  const handleRemove = (id: number) => {
    removeFromWishlist(id)
  }

  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        description: item.description,
        category: item.category,
      })
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">{wishlistItems.length} items saved for later</p>
        </div>
        {wishlistItems.length > 0 && (
          <Button variant="outline" onClick={handleAddAllToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add All to Cart
          </Button>
        )}
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
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground line-clamp-2">{item.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <AddToCartButton
                    product={{
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image || "",
                      description: item.description || "",
                      category: item.category || "",
                    }}
                  />
                </div>
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

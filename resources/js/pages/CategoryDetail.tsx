"use client"

import { useState, useMemo } from "react"
import { ChevronRight, Star, Heart, ShoppingCart, ChevronDown } from "lucide-react"
import ShopFrontLayout from "@/layouts/shop-layout"
import { Link, usePage } from '@inertiajs/react'

interface Product {
  id: number
  name: string
  price: number
  sale_price?: number
  rating?: number
  reviews_count?: number
  image?: string
  image_url?: string
  category_id: number
  in_stock: boolean
  stock_quantity: number
}

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  image?: string
  image_url?: string
}

interface PaginatedProducts {
  data: Product[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface PageProps {
  category: Category
  products: PaginatedProducts
  [key: string]: unknown
}

export default function CategoryDetail() {
  const { category, products } = usePage<PageProps>().props
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedRating, setSelectedRating] = useState(0)
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = [...products.data].filter((product) => {
      const withinPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1]
      const meetsRating = selectedRating === 0 || (product.rating || 0) >= selectedRating
      const inStockCheck = !showOnlyInStock || product.in_stock

      return withinPriceRange && meetsRating && inStockCheck
    })

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price))
        break
      case "price-high":
        filtered.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price))
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "newest":
        filtered.reverse()
        break
      case "featured":
      default:
        break
    }

    return filtered
  }, [products.data, sortBy, priceRange, selectedRating, showOnlyInStock])

  const getProductImage = (product: Product) => {
    if (product.image_url) return product.image_url
    if (product.image) {
      if (product.image.startsWith('http')) return product.image
      return `/storage/${product.image}`
    }
    return '/placeholder.jpg'
  }

  const getDisplayPrice = (product: Product) => {
    return Number(product.sale_price || product.price || 0);
  }

  const hasDiscount = (product: Product) => {
    return product.sale_price && product.sale_price < product.price
  }

  return (
    <ShopFrontLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <Link href="/categories" className="text-gray-500 hover:text-gray-700">
            Categories
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="text-gray-900 font-medium">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-gray-600">{category.description}</p>
          )}
          <p className="mt-2 text-gray-600">Showing {filteredProducts.length} of {products.total} products</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 space-y-6 sticky top-20">
              {/* Sort */}
              <div className="relative">
                <label className="text-sm font-medium text-gray-900 mb-2 block">Sort By</label>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="capitalize">
                    {sortBy === "featured"
                      ? "Featured"
                      : sortBy === "price-low"
                        ? "Price: Low to High"
                        : sortBy === "price-high"
                          ? "Price: High to Low"
                          : sortBy === "rating"
                            ? "Highest Rated"
                            : "Newest"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isSortOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 z-10 shadow-lg">
                    {[
                      { value: "featured", label: "Featured" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                      { value: "rating", label: "Highest Rated" },
                      { value: "newest", label: "Newest" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setIsSortOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-gray-700 first:rounded-t-md last:rounded-b-md"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-4 block">Price Range</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-3 block">Rating</label>
                <div className="space-y-2">
                  {[
                    { value: 0, label: "All Ratings" },
                    { value: 4, label: "4+ Stars" },
                    { value: 3, label: "3+ Stars" },
                    { value: 2, label: "2+ Stars" },
                  ].map((rating) => (
                    <label key={rating.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating.value}
                        onChange={() => setSelectedRating(rating.value)}
                        className="rounded border-gray-300 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">{rating.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In Stock Filter */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyInStock}
                    onChange={(e) => setShowOnlyInStock(e.target.checked)}
                    className="rounded border-gray-300 h-4 w-4"
                  />
                  <span className="ml-2 text-sm text-gray-900 font-medium">In Stock Only</span>
                </label>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSortBy("featured")
                  setPriceRange([0, 10000])
                  setSelectedRating(0)
                  setShowOnlyInStock(false)
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium transition"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id} className="group block">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder.jpg'
                        }}
                      />
                      {hasDiscount(product) && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Sale
                        </div>
                      )}
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-medium">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600 transition">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      {product.rating && product.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating || 0)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : i < (product.rating || 0)
                                      ? "text-yellow-400 fill-yellow-400 opacity-50"
                                      : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          {product.reviews_count && product.reviews_count > 0 && (
                            <span className="text-xs text-gray-600">({product.reviews_count})</span>
                          )}
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${getDisplayPrice(product).toFixed(2)}
                        </span>
                        {hasDiscount(product) && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-xs font-medium transition flex items-center justify-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          disabled={!product.in_stock}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-md transition"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSortBy("featured")
                    setPriceRange([0, 10000])
                    setSelectedRating(0)
                    setShowOnlyInStock(false)
                  }}
                  className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ShopFrontLayout>
  )
}

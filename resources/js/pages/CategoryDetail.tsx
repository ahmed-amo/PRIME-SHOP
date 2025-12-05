"use client"

import { useState, useMemo, useEffect } from "react"
import { ChevronRight, Star, ChevronDown } from "lucide-react"
import ShopFrontLayout from "@/layouts/shop-layout"
import { Link, usePage } from '@inertiajs/react'
import { Product } from "@/types/products"
import { Category } from "@/types/categories"
import AddToCartButton from "@/components/AddToCartButton"
import FavoriteButton from "@/components/FavoriteButton"

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

  // Compute min/max prices dynamically
  const minPrice = Math.min(...products.data.map(p => p.price))
  const maxPrice = Math.max(...products.data.map(p => p.price))

  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice])
  const [selectedRating, setSelectedRating] = useState(0)
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  useEffect(() => {
    setPriceRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  // Filter products
  const filteredProducts = useMemo(() => {
    const filtered = [...products.data].filter((product) => {
      const withinPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1]
      const meetsRating = selectedRating === 0 || (product.rating || 0) >= selectedRating
      const inStockCheck = !showOnlyInStock || product.in_stock
      return withinPriceRange && meetsRating && inStockCheck
    })

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "newest":
        filtered.reverse()
        break
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


  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange = [...priceRange]
    newRange[index] = value

    // Ensure min doesn't exceed max and vice versa
    if (index === 0 && value > priceRange[1]) {
      newRange[1] = value
    } else if (index === 1 && value < priceRange[0]) {
      newRange[0] = value
    }

    setPriceRange(newRange)
  }

  return (
    <ShopFrontLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 bg-white">

        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <Link href="/categories" className="text-gray-500 hover:text-gray-700">Categories</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="text-gray-900 font-medium">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-gray-600">{category.description}</p>
          )}
          <p className="mt-2 text-gray-600">
            Showing {filteredProducts.length} of {products.total} products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Filters */}
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
                    {sortBy === "featured" ? "Featured"
                      : sortBy === "price-low" ? "Price: Low to High"
                        : sortBy === "price-high" ? "Price: High to Low"
                          : sortBy === "rating" ? "Highest Rated" : "Newest"}
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

              {/* Enhanced Price Range */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-4 block">Price Range</label>
                <div className="space-y-4">
                  {/* Price Display */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">${priceRange[0].toFixed(2)}</span>
                    <span className="text-gray-400">—</span>
                    <span className="font-semibold text-gray-700">${priceRange[1].toFixed(2)}</span>
                  </div>

                  {/* Dual Range Slider */}
                  <div className="relative pt-2 pb-4">
                    {/* Track Background */}
                    <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full -translate-y-1/2"></div>

                    {/* Active Track */}
                    <div
                      className="absolute top-1/2 h-2 bg-orange-500 rounded-full -translate-y-1/2"
                      style={{
                        left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                        right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`
                      }}
                    ></div>

                    {/* Min Range Slider */}
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      step="0.01"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                      className="absolute w-full pointer-events-auto appearance-none bg-transparent"
                      style={{
                        zIndex: priceRange[0] > maxPrice - 100 ? 5 : 3,
                      }}
                    />

                    {/* Max Range Slider */}
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      step="0.01"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                      className="absolute w-full pointer-events-auto appearance-none bg-transparent"
                      style={{
                        zIndex: 4,
                      }}
                    />
                  </div>

                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-3 block">Rating</label>
                <div className="space-y-2">
                  {[0, 4, 3, 2].map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => setSelectedRating(rating)}
                        className="rounded border-gray-300 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {rating === 0 ? "All Ratings" : `${rating}+ Stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In Stock */}
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

              {/* Reset */}
              <button
                onClick={() => {
                  setSortBy("featured")
                  setPriceRange([minPrice, maxPrice])
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
                  <div key={product.id} className="group relative">
                    <Link href={`/product/${product.slug}`} className="block">
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                          onError={(e) => { const target = e.target as HTMLImageElement; target.src = '/placeholder.jpg' }}
                        />
                        {!product.in_stock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-medium">Out of Stock</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Favorite button overlay */}
                    <div className="absolute top-2 right-2 z-10">
                      <FavoriteButton
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: getProductImage(product),
                          description: product.description || "",
                          category: product.category || "",
                          slug: product.slug,
                        }}
                        variant="icon"
                        className="bg-white bg-opacity-90 hover:bg-opacity-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600 transition">
                        {product.name}
                      </h3>
                      {product.rating && product.rating > 0 && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                          ))}
                          {product.reviews_count && (
                            <span className="text-xs text-gray-600">({product.reviews_count})</span>
                          )}
                        </div>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <div
                          onClick={(e) => e.preventDefault()}
                          className="flex-1"
                        >
                          <AddToCartButton
                            product={{
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: getProductImage(product),
                              description: product.description || "",
                              category: product.category || "",
                            }}
                            variant="outline"
                            disabled={!product.in_stock}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSortBy("featured")
                    setPriceRange([minPrice, maxPrice])
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

      <style >{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 18px;
          width: 18px;
          background-color: #f97316;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          cursor: pointer;
        }

        input[type="range"]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          background-color: #f97316;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          cursor: pointer;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          background-color: #ea580c;
        }

        input[type="range"]::-moz-range-thumb:hover {
          background-color: #ea580c;
        }
      `}</style>
    </ShopFrontLayout>
  )
}

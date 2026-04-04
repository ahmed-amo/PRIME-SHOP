"use client"

import { useState, useMemo, useEffect, FormEvent } from "react"
import { ChevronRight, Star, ChevronDown, Search } from "lucide-react"
import ShopFrontLayout from "@/layouts/shop-layout"
import { Link, router, usePage } from "@inertiajs/react"
import { Product } from "@/types/products"
import AddToCartButton from "@/components/AddToCartButton"
import FavoriteButton from "@/components/FavoriteButton"
import { useI18n, localizePaginationLabelHtml } from "@/lib/i18n"

interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

interface PaginatedProducts {
  data: Product[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links?: PaginationLink[]
}

interface PageProps {
  filters: { q: string }
  products: PaginatedProducts
  [key: string]: unknown
}

export default function ProductsCatalog() {
  const { filters, products } = usePage<PageProps>().props
  const { t, locale, formatPrice } = useI18n()

  const priceValues = products.data.map((p) => p.price)
  const minPrice = priceValues.length ? Math.min(...priceValues) : 0
  const maxPrice = priceValues.length ? Math.max(...priceValues) : 30_000
  const rangeSpan = maxPrice - minPrice || 1

  const [query, setQuery] = useState(filters.q ?? "")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice])
  const [selectedRating, setSelectedRating] = useState(0)
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  useEffect(() => {
    setQuery(filters.q ?? "")
  }, [filters.q])

  useEffect(() => {
    setPriceRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

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
      if (product.image.startsWith("http")) return product.image
      if (product.image.startsWith("catpics/") || product.image.startsWith("producss/")) {
        return `/${product.image}`
      }
      return `/storage/${product.image}`
    }
    return "/placeholder.jpg"
  }

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange = [...priceRange]
    newRange[index] = value

    if (index === 0 && value > priceRange[1]) {
      newRange[1] = value
    } else if (index === 1 && value < priceRange[0]) {
      newRange[0] = value
    }

    setPriceRange(newRange)
  }

  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    router.get(
      "/products",
      { q: query.trim() || undefined },
      { preserveState: true, preserveScroll: true, replace: true },
    )
  }

  return (
    <ShopFrontLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            {t("Home")}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 rtl:rotate-180" />
          <span className="font-medium text-gray-900">{t("All products")}</span>
        </nav>

        <div className="mb-8 text-start">
          <h1 className="text-3xl font-bold text-gray-900">{t("All products")}</h1>
          <p className="mt-2 text-gray-600">{t("Products catalog intro")}</p>

          <form onSubmit={submitSearch} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center rtl:sm:flex-row-reverse">
            <div className="relative max-w-xl flex-1">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("Search products...")}
                className="w-full rounded-xl border border-gray-200 py-3 ps-11 pe-4 text-start text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                name="q"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-orange-600"
            >
              {t("Search")}
            </button>
          </form>

          <p className="mt-4 text-gray-600">
            {t("Showing products count")
              .replace("{shown}", String(filteredProducts.length))
              .replace("{total}", String(products.total))}
            {filters.q ? ` ${t("for query")} "${filters.q}"` : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6 rounded-lg bg-gray-50 p-6 text-start">
              <div className="relative">
                <label className="mb-2 block text-sm font-medium text-gray-900">{t("Sort By")}</label>
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex w-full items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span>
                    {sortBy === "featured"
                      ? t("Featured")
                      : sortBy === "price-low"
                        ? t("Price: Low to High")
                        : sortBy === "price-high"
                          ? t("Price: High to Low")
                          : sortBy === "rating"
                            ? t("Highest Rated")
                            : t("Newest")}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 rtl:rotate-180" />
                </button>

                {isSortOpen && (
                  <div className="absolute start-0 end-0 top-full z-10 mt-1 rounded-md border border-gray-300 bg-white shadow-lg">
                    {[
                      { value: "featured", label: t("Featured") },
                      { value: "price-low", label: t("Price: Low to High") },
                      { value: "price-high", label: t("Price: High to Low") },
                      { value: "rating", label: t("Highest Rated") },
                      { value: "newest", label: t("Newest") },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSortBy(option.value)
                          setIsSortOpen(false)
                        }}
                        className="w-full px-3 py-2 text-start text-sm text-gray-700 first:rounded-t-md last:rounded-b-md hover:bg-gray-50"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-4 block text-sm font-medium text-gray-900">{t("Price Range")}</label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 text-sm rtl:flex-row-reverse">
                    <span className="font-semibold text-gray-700 tabular-nums">{formatPrice(priceRange[0])}</span>
                    <span className="text-gray-400">—</span>
                    <span className="font-semibold text-gray-700 tabular-nums">{formatPrice(priceRange[1])}</span>
                  </div>

                  <div className="relative pt-2 pb-4" dir="ltr">
                    <div className="absolute start-0 end-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gray-200" />
                    <div
                      className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-orange-500"
                      style={{
                        left: `${((priceRange[0] - minPrice) / rangeSpan) * 100}%`,
                        right: `${100 - ((priceRange[1] - minPrice) / rangeSpan) * 100}%`,
                      }}
                    />
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      step="1"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                      className="absolute w-full pointer-events-auto appearance-none bg-transparent"
                      style={{ zIndex: priceRange[0] > maxPrice - 100 ? 5 : 3 }}
                    />
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      step="1"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                      className="absolute w-full pointer-events-auto appearance-none bg-transparent"
                      style={{ zIndex: 4 }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-gray-900">{t("Rating")}</label>
                <div className="space-y-2">
                  {[0, 4, 3, 2].map((rating) => (
                    <label key={rating} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => setSelectedRating(rating)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        {rating === 0 ? t("All Ratings") : t("Stars plus").replace("{n}", String(rating))}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showOnlyInStock}
                    onChange={(e) => setShowOnlyInStock(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-900">{t("In Stock Only")}</span>
                </label>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSortBy("featured")
                  setPriceRange([minPrice, maxPrice])
                  setSelectedRating(0)
                  setShowOnlyInStock(false)
                }}
                className="w-full rounded-md bg-orange-500 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                {t("Reset Filters")}
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="group relative">
                      <Link href={`/product/${product.slug}`} className="block">
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.jpg"
                            }}
                          />
                          {!product.in_stock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                              <span className="font-medium text-white">{t("Out of Stock")}</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="absolute end-2 top-2 z-10">
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
                      <div className="space-y-2 text-start">
                        <h3 className="line-clamp-2 text-sm font-medium text-gray-900 transition group-hover:text-orange-600">
                          {product.name}
                        </h3>
                        {product.rating && product.rating > 0 && (
                          <div className="flex items-center gap-1 rtl:flex-row-reverse">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                            {product.reviews_count && (
                              <span className="text-xs text-gray-600">({product.reviews_count})</span>
                            )}
                          </div>
                        )}
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900 tabular-nums">{formatPrice(product.price)}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <div onClick={(e) => e.preventDefault()} className="flex-1">
                            <AddToCartButton
                              product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: getProductImage(product),
                                description: product.description || "",
                                category: product.category || "",
                              }}
                              variant="default"
                              disabled={!product.in_stock}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {products.last_page > 1 && products.links && (
                  <nav className="mt-10 flex flex-wrap items-center justify-center gap-1" aria-label="Pagination">
                    {products.links.map((link, i) =>
                      link.url ? (
                        <Link
                          key={i}
                          href={link.url}
                          preserveScroll
                          className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium ${
                            link.active
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          dangerouslySetInnerHTML={{ __html: localizePaginationLabelHtml(link.label, locale) }}
                        />
                      ) : (
                        <span
                          key={i}
                          className="min-w-[2.5rem] px-3 py-2 text-sm text-gray-400"
                          dangerouslySetInnerHTML={{ __html: localizePaginationLabelHtml(link.label, locale) }}
                        />
                      ),
                    )}
                  </nav>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg text-gray-500">{t("No products found matching filters")}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("featured")
                    setPriceRange([minPrice, maxPrice])
                    setSelectedRating(0)
                    setShowOnlyInStock(false)
                  }}
                  className="mt-4 font-medium text-orange-500 hover:text-orange-600"
                >
                  {t("Clear all filters")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
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
      `}</style>
    </ShopFrontLayout>
  )
}

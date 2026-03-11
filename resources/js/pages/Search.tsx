import { usePage, Link } from "@inertiajs/react"
import { Search, Package, Tag } from "lucide-react"
import ShopFrontLayout from "@/layouts/shop-layout"
import AddToCartButton from "@/components/AddToCartButton"
import { Product } from "@/types/products"
import { PageProps } from "@/types"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  image_url: string | null
}

interface SearchProps extends PageProps {
    query: string
    products: { data: Product[]; total: number }
    categories: Category[]
  }

export default function SearchPage() {
  const { query, products, categories } = usePage<SearchProps>().props

  const hasResults = products.data?.length > 0 || categories.length > 0
  const totalProducts = products.total ?? 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {query && hasResults && (
          <p className="text-gray-500 mt-1 text-sm">
            {totalProducts} product{totalProducts !== 1 ? "s" : ""}
            {categories.length > 0 && ` · ${categories.length} categor${categories.length !== 1 ? "ies" : "y"}`} found
          </p>
        )}
      </div>

      {/* No query */}
      {!query && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-lg font-medium text-gray-900">Start searching</p>
          <p className="text-gray-500 text-sm mt-1">Type something in the search bar above</p>
        </div>
      )}

      {/* No results */}
      {query && !hasResults && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-900">No results for "{query}"</p>
          <p className="text-gray-500 text-sm mt-2">Try different keywords or browse our categories</p>
          <Link href="/categories" className="mt-4 text-orange-500 hover:underline font-medium text-sm">
            Browse Categories
          </Link>
        </div>
      )}

      {/* Categories Results */}
      {categories.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900">Categories</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl hover:border-orange-400 hover:shadow-md transition-all group"
              >
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-orange-500" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-orange-500 transition truncate">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-gray-400 truncate">{cat.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Results */}
      {products.data?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900">Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.data.map(product => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition group">
                <Link href={`/product/${product.slug}`}>
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image_url ?? "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.jpg" }}
                    />
                  </div>
                </Link>
                <div className="p-4 space-y-3">
                  <Link href={`/product/${product.slug}`}>
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-orange-500 transition">
                      {product.name}
                    </p>
                  </Link>
                  {product.category && (
                    <p className="text-xs text-gray-400">{product.category}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    {!product.in_stock && (
                      <span className="text-xs text-red-500 font-medium">Out of stock</span>
                    )}
                  </div>
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image_url ?? "",
                      description: product.description ?? "",
                      stock: product.stock,
                      in_stock: product.in_stock,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

SearchPage.layout = (page: React.ReactNode) => <ShopFrontLayout>{page}</ShopFrontLayout>

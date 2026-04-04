import { usePage, Link } from "@inertiajs/react"
import { Search, Package, Tag } from "lucide-react"
import ShopFrontLayout from "@/layouts/shop-layout"
import AddToCartButton from "@/components/AddToCartButton"
import { Product } from "@/types/products"
import { PageProps } from "@/types"
import { useI18n } from "@/lib/i18n"

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
  const { t, formatPrice } = useI18n()

  const hasResults = products.data?.length > 0 || categories.length > 0
  const totalProducts = products.total ?? 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 text-start">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {query ? t("Search results for").replace("{q}", query) : t("Search")}
        </h1>
        {query && hasResults && (
          <p className="mt-1 text-sm text-gray-500">
            {t("Found products count").replace("{n}", String(totalProducts))}
            {categories.length > 0
              ? ` · ${t("Found categories count").replace("{n}", String(categories.length))}`
              : ""}
          </p>
        )}
      </div>

      {/* No query */}
      {!query && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <Search className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-lg font-medium text-gray-900">{t("Start searching")}</p>
          <p className="mt-1 text-sm text-gray-500">{t("Search empty hint")}</p>
        </div>
      )}

      {/* No results */}
      {query && !hasResults && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-900">{t("No results for").replace("{q}", query)}</p>
          <p className="mt-2 text-sm text-gray-500">{t("Search no results hint")}</p>
          <Link href="/categories" className="mt-4 text-sm font-medium text-orange-500 hover:underline">
            {t("Browse Categories")}
          </Link>
        </div>
      )}

      {/* Categories Results */}
      {categories.length > 0 && (
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2 rtl:flex-row-reverse">
            <Tag className="h-4 w-4 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900">{t("Categories")}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={route("category.show", { category: cat.slug })}
                className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-orange-400 hover:shadow-md rtl:flex-row-reverse"
              >
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-orange-500" />
                  </div>
                )}
                <div className="min-w-0 text-start">
                  <p className="truncate text-sm font-semibold text-gray-900 transition group-hover:text-orange-500">{cat.name}</p>
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
          <div className="mb-4 flex items-center gap-2 rtl:flex-row-reverse">
            <Package className="h-4 w-4 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900">{t("Products")}</h2>
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
                <div className="space-y-3 p-4 text-start">
                  <Link href={`/product/${product.slug}`}>
                    <p className="line-clamp-2 text-sm font-semibold text-gray-900 transition group-hover:text-orange-500">
                      {product.name}
                    </p>
                  </Link>
                  {product.category && (
                    <p className="text-xs text-gray-400">{product.category}</p>
                  )}
                  <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
                    <span className="font-bold text-gray-900 tabular-nums">{formatPrice(product.price)}</span>
                    {!product.in_stock && (
                      <span className="text-xs font-medium text-red-500">{t("Out of stock")}</span>
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

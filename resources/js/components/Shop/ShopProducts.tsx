"use client";

import React, { memo } from "react";
import { Link } from "@inertiajs/react";
import { Product } from "@/types/products";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

/** Two rows on large screens (4 cols × 2 = 8); fewer on smaller breakpoints. */
const PREVIEW_LIMIT = 8;

const ease = [0.25, 0.1, 0.25, 1] as const;
const headerViewport = { once: true, margin: "-80px" } as const;
const cardViewport = { once: true, margin: "-60px" } as const;

function ShopProductsInner({ products }: { products: Product[] | { data: Product[] } }) {
  const { t, formatPrice } = useI18n();
  const productList: Product[] = Array.isArray(products) ? products : products?.data || [];
  const preview = productList.slice(0, PREVIEW_LIMIT);
  const placeholder = "/placeholder.jpg";

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 md:py-5">
      <motion.div
        className="mb-4 text-center sm:mb-5 sm:text-start"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={headerViewport}
        transition={{ duration: 0.4, ease }}
      >
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">{t("Featured products")}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600 sm:mx-0 sm:text-base">
          {t("Featured products subtitle")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {preview.map((product, index) => (
          <motion.div
            key={product.id}
            className="bg-white shadow rounded-xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 group relative"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={cardViewport}
            transition={{
              duration: 0.4,
              ease,
              delay: Math.min(index, 12) * 0.06,
            }}
          >
            <Link href={`/product/${product.slug ?? product.id}`} className="relative block">
              {product.is_on_sale && (product.discount_percentage ?? 0) > 0 && (
                <span className="absolute start-2 top-2 z-20 rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold text-white shadow">
                  -{product.discount_percentage}%
                </span>
              )}
              <img
                src={product.image_url ?? placeholder}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-56"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.src = placeholder;
                }}
              />
            </Link>

            <div className="absolute end-3 top-3 z-10">
              <FavoriteButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image_url ?? "",
                  description: product.description ?? "",
                  category: product.category ?? "",
                  slug: product.slug,
                }}
                variant="icon"
              />
            </div>

            <div className="flex flex-1 flex-col p-3 sm:p-4">
              <Link href={`/product/${product.slug ?? product.id}`}>
                <h3 className="line-clamp-2 text-base font-medium text-gray-800 transition-colors group-hover:text-orange-500 sm:line-clamp-1 sm:text-lg">
                  {product.name}
                </h3>
              </Link>
              <p className="mb-3 line-clamp-2 text-start text-sm text-gray-600">{product.description}</p>

              <div className="mt-auto space-y-3">
                <div className="flex flex-col gap-0.5">
                  {product.is_on_sale &&
                    product.original_display_price != null &&
                    product.original_display_price > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.original_display_price)}
                      </span>
                    )}
                  <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                </div>

                <div onClick={(e) => e.preventDefault()}>
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
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-6 flex justify-center md:mt-8"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={headerViewport}
        transition={{ duration: 0.4, ease, delay: 0.2 }}
      >
        <Link
          href="/products"
          className="inline-flex w-full max-w-sm items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:w-auto sm:max-w-none sm:px-8 touch-manipulation"
        >
          {t("View all products")}
        </Link>
      </motion.div>
    </div>
  );
}

const ShopProducts = memo(ShopProductsInner);
export default ShopProducts;

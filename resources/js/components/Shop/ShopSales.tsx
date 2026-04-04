import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronLeft,
  Eye,
  Tag,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import { motion } from "framer-motion";
import { slideUp } from "@/lib/motionVariants";
import { useI18n } from "@/lib/i18n";

type SalesProduct = {
  id: number;
  name: string;
  slug: string;
  originalPrice: number;
  price: number; // discounted price
  discountPercentage: number;
  description: string;
  image_url: string | null;
  category: string | null;
  rating: number;
  stock: number;
  favorite?: boolean;
};

// Star rating component
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center rtl:flex-row-reverse">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${
            i < Math.floor(rating)
              ? "text-amber-400"
              : i < rating
              ? "text-amber-400"
              : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ms-1 text-xs text-gray-600 tabular-nums">{rating.toFixed(1)}</span>
    </div>
  );
};

// Product Card Component with discount
const ProductCard: React.FC<{
  product: SalesProduct;
}> = ({ product }) => {
  const { t, formatPrice } = useI18n();
  const placeholder = "/placeholder.jpg";
  const imageUrl = product.image_url || placeholder;

  return (
    <div className="group relative flex flex-col h-full rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300">
      {/* Image container with aspect ratio */}
      <div className="relative w-full pb-[100%] bg-gray-50 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholder;
          }}
        />

        {/* Badges */}
        <div className="absolute start-3 top-3 flex flex-col gap-2">
          {product.discountPercentage > 0 && (
            <span className="rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
              {t("sale.discount.label").replace("{n}", String(product.discountPercentage))}
            </span>
          )}
          {product.stock <= 10 && product.stock > 0 && (
            <span className="rounded-lg bg-amber-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
              {t("stock.only.n.left").replace("{n}", String(product.stock))}
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-lg bg-gray-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
              {t("Out of Stock")}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute end-3 top-3">
          <FavoriteButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: imageUrl,
              description: product.description || "",
              category: product.category || "",
              slug: product.slug,
            }}
            variant="icon"
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
          />
        </div>

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-100 rtl:flex-row-reverse"
            >
              <Eye size={16} />
              <span>{t("Quick View")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="flex flex-grow flex-col p-4">
        <div className="mb-1 text-start">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {product.category || t("Uncategorized")}
          </span>
          <h3 className="mt-1 line-clamp-1 text-sm font-medium text-gray-900">
            {product.name}
          </h3>
        </div>

        <div className="mt-1 mb-3">
          <StarRating rating={product.rating} />
        </div>

        <p className="mb-3 line-clamp-2 text-start text-xs text-gray-500">
          {product.description || t("No description available")}
        </p>

        <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-3 rtl:flex-row-reverse">
          <div className="flex flex-col text-start">
            <span className="text-xs text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: imageUrl,
                description: product.description || "",
                category: product.category || "",
              }}
              variant="icon"
              disabled={product.stock === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Carousel Component
interface ShopSalesProps {
  products?: SalesProduct[];
  /** Use on product detail: no duplicate max-width / horizontal padding. */
  embedded?: boolean;
}

const ProductTwo: React.FC<ShopSalesProps> = ({ products: propsProducts = [], embedded = false }) => {
  const { t, direction } = useI18n();
  const isRtl = direction === "rtl";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState(4);
  const carouselRef = useRef<HTMLDivElement>(null);

  const products: SalesProduct[] = propsProducts;

  // Handle screen resize to adjust number of visible products
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setVisibleProducts(4);
      } else if (window.innerWidth >= 1024) {
        setVisibleProducts(3);
      } else if (window.innerWidth >= 768) {
        setVisibleProducts(2);
      } else {
        setVisibleProducts(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation functions
  const goToNext = () => {
    if (products.length <= visibleProducts) return;
    setCurrentIndex((prev) =>
      prev + 1 >= products.length - visibleProducts + 1 ? 0 : prev + 1
    );
  };

  const goToPrev = () => {
    if (products.length <= visibleProducts) return;
    setCurrentIndex((prev) =>
      prev - 1 < 0 ? Math.max(0, products.length - visibleProducts) : prev - 1
    );
  };


  // Auto scroll function
  useEffect(() => {
    if (products.length <= visibleProducts) return;
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, products.length, visibleProducts]);

  // Don't render if no products
  if (!products || products.length === 0) {
    return null;
  }

  const maxIndex = Math.max(0, products.length - visibleProducts);

  return (
    <motion.div
      className={cn(
        "w-full bg-white py-5 md:py-7",
        embedded
          ? "max-w-none px-0 sm:rounded-2xl sm:border sm:border-gray-100 sm:bg-gradient-to-b sm:from-gray-50/90 sm:to-white sm:p-5 md:p-6"
          : "mx-auto max-w-7xl px-3 sm:px-4",
      )}
      variants={slideUp}
      initial="initial"
      animate="animate"
    >
      <div className="mb-4 flex flex-col items-start justify-between gap-3 md:mb-5 md:flex-row md:items-end md:gap-4 rtl:md:flex-row-reverse">
        <div className="text-start">
          <div className="mb-2 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold tracking-wide text-red-600">
            {t("SPECIAL OFFERS")}
          </div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl rtl:flex-row-reverse">
            <Tag className="h-5 w-5 shrink-0 text-red-500 sm:h-6 sm:w-6" aria-hidden />
            <span className="relative">
              {t("Spring Sale Collection")}
              <span className="absolute -bottom-2 start-0 end-0 h-1 rounded-full bg-red-500" />
            </span>
          </h2>
          <p className="mt-2 text-gray-500">
            {t("Sales section subtitle")}
          </p>
        </div>

        {products.length > visibleProducts && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={isRtl ? goToNext : goToPrev}
              className="rounded-full border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow"
              aria-label={t("Previous products")}
            >
              {isRtl ? <ChevronRight size={18} className="text-gray-700" /> : <ChevronLeft size={18} className="text-gray-700" />}
            </button>
            <button
              type="button"
              onClick={isRtl ? goToPrev : goToNext}
              className="rounded-full border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow"
              aria-label={t("Next products")}
            >
              {isRtl ? <ChevronLeft size={18} className="text-gray-700" /> : <ChevronRight size={18} className="text-gray-700" />}
            </button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden" ref={carouselRef}>
        <div style={{ direction: "ltr" }}>
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${
                products.length <= visibleProducts
                  ? 0
                  : currentIndex * (100 / visibleProducts)
              }%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-full flex-shrink-0 px-3 md:w-1/2 lg:w-1/3 xl:w-1/4"
                style={{ direction: isRtl ? "rtl" : "ltr" }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      {products.length > visibleProducts && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({
            length: Math.min(maxIndex + 1, 8),
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-red-500 w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* View all button */}
      <div className="mt-5 flex justify-center px-2 md:mt-6">
        <Link
          href="/shop"
          className="w-full max-w-xs touch-manipulation rounded-lg border-2 border-gray-900 px-6 py-2.5 text-center text-sm font-medium text-gray-900 transition-colors duration-300 hover:bg-gray-900 hover:text-white sm:w-auto sm:max-w-none sm:text-base"
        >
          {t("View All Sales")}
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductTwo;

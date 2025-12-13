import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Eye,
  Tag,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";

// Product type definition matching backend structure
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
    <div className="flex items-center">
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
      <span className="ml-1 text-xs text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

// Product Card Component with discount
const ProductCard: React.FC<{
  product: SalesProduct;
}> = ({ product }) => {
  const placeholder = "/placeholder.jpg";
  const imageUrl = product.image_url || placeholder;

  return (
    <div  id="sales" className="group relative flex flex-col h-full rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300">
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
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discountPercentage > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.stock <= 10 && product.stock > 0 && (
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded-lg shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3">
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
              className="flex items-center gap-1 py-2 px-3 bg-white text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-md"
            >
              <Eye size={16} />
              <span>Quick View</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="flex flex-col p-4 flex-grow">
        <div className="mb-1">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {product.category || "Uncategorized"}
          </span>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mt-1">
            {product.name}
          </h3>
        </div>

        <div className="mt-1 mb-3">
          <StarRating rating={product.rating} />
        </div>

        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {product.description || "No description available"}
        </p>

        <div className="mt-auto pt-3 flex items-end justify-between border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-lg text-gray-900">
                ${product.price.toFixed(2)}
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
}

const ProductTwo: React.FC<ShopSalesProps> = ({ products: propsProducts = [] }) => {
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
    <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold tracking-wide mb-2">
            SPECIAL OFFERS
          </div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="text-red-500" size={24} />
            <span className="relative">
              Spring Sale Collection
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-red-500 rounded-full"></span>
            </span>
          </h2>
          <p className="text-gray-500 mt-2">
            Exclusive deals on premium products. Limited time only.
          </p>
        </div>

        {products.length > visibleProducts && (
          <div className="flex space-x-3">
            <button
              onClick={goToPrev}
              className="p-3 rounded-full bg-white shadow-sm hover:shadow border border-gray-200 hover:border-gray-300 transition-all duration-200"
              aria-label="Previous products"
            >
              <ChevronLeft size={18} className="text-gray-700" />
            </button>
            <button
              onClick={goToNext}
              className="p-3 rounded-full bg-white shadow-sm hover:shadow border border-gray-200 hover:border-gray-300 transition-all duration-200"
              aria-label="Next products"
            >
              <ChevronRight size={18} className="text-gray-700" />
            </button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden" ref={carouselRef}>
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
              className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-3"
            >
              <ProductCard
                product={product}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      {products.length > visibleProducts && (
        <div className="flex justify-center mt-6 space-x-2">
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
      <div className="flex justify-center mt-8">
        <Link
          href="/shop"
          className="px-6 py-2 border-2 border-gray-900 text-gray-900 font-medium rounded-lg hover:bg-gray-900 hover:text-white transition-colors duration-300"
        >
          View All Sales
        </Link>
      </div>
    </div>
  );
};

export default ProductTwo;

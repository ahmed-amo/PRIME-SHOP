
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  ShoppingCart,
  Eye,
  Tag,
} from "lucide-react";
import { Link } from "@inertiajs/react";

// Product type definition with discount properties
type Product = {
  id: string;
  name: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  isNew?: boolean;
  favorite?: boolean;
  inCart?: boolean;
  stock: number;
};

// Sample product data with Unsplash images
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Italian Leather Crossbody Bag",
    originalPrice: 249.99,
    discountPrice: 189.99,
    discountPercentage: 24,
    description: "Handcrafted in Florence with premium full-grain leather",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    rating: 4.9,
    isNew: true,
    stock: 15,
  },
  {
    id: "2",
    name: "Automatic Chronograph Watch",
    originalPrice: 599.99,
    discountPrice: 449.99,
    discountPercentage: 25,
    description:
      "Swiss-made movement with sapphire crystal and exhibition caseback",
    image:
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Watches",
    rating: 4.8,
    stock: 8,
  },
  {
    id: "3",
    name: "Premium Wireless Earbuds",
    originalPrice: 199.99,
    discountPrice: 149.99,
    discountPercentage: 25,
    description: "Active noise cancellation with 30-hour battery life",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    rating: 4.7,
    stock: 22,
  },
  {
    id: "4",
    name: "Pure Cashmere Sweater",
    originalPrice: 299.99,
    discountPrice: 199.99,
    discountPercentage: 33,
    description: "Ultra-soft, sustainably sourced cashmere in a relaxed fit",
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Clothing",
    rating: 4.6,
    stock: 10,
  },
  {
    id: "5",
    name: "Smart Home Security Camera",
    originalPrice: 179.99,
    discountPrice: 129.99,
    discountPercentage: 28,
    description: "4K resolution with night vision and two-way audio",
    image:
      "https://images.unsplash.com/photo-1580745294621-2914fd8fee67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    rating: 4.5,
    isNew: true,
    stock: 18,
  },
  {
    id: "6",
    name: "Artisanal Ceramic Pour-Over Set",
    originalPrice: 89.99,
    discountPrice: 64.99,
    discountPercentage: 28,
    description:
      "Hand-thrown ceramic pour-over coffee dripper with matching cup",
    image:
      "https://images.unsplash.com/photo-1516543647435-f8c78a45081f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Home & Kitchen",
    rating: 4.7,
    stock: 12,
  },
  {
    id: "7",
    name: "Designer Sunglasses",
    originalPrice: 159.99,
    discountPrice: 99.99,
    discountPercentage: 38,
    description: "Polarized lenses with premium acetate frames",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    rating: 4.8,
    stock: 9,
  },
  {
    id: "8",
    name: "Luxury Scented Candle",
    originalPrice: 69.99,
    discountPrice: 49.99,
    discountPercentage: 29,
    description: "Hand-poured soy wax with essential oils, 60-hour burn time",
    image:
      "https://images.unsplash.com/photo-1602178141046-c9fe5b7eade4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Home & Decor",
    rating: 4.6,
    stock: 20,
  },
];

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
  product: Product;
  onFavoriteToggle: (id: string) => void;
  onAddToCart: (id: string) => void;
}> = ({ product, onFavoriteToggle, onAddToCart }) => {
  return (
    <div className="group relative flex flex-col h-full rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300">
      {/* Image container with aspect ratio */}
      <div className="relative w-full pb-[100%] bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discountPercentage > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm">
              NEW
            </span>
          )}
          {product.stock <= 10 && (
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => onFavoriteToggle(product.id)}
            className="flex items-center justify-center w-8 h-8 mb-2 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 shadow-sm transition-all duration-200"
            aria-label="Add to favorites"
          >
            <Heart
              size={16}
              className={
                product.favorite ? "fill-red-500 text-red-500" : "text-gray-700"
              }
            />
          </button>
        </div>

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
            <Link href="/product" className="flex items-center gap-1 py-2 px-3 bg-white text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-md">
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
            {product.category}
          </span>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mt-1">
            {product.name}
          </h3>
        </div>

        <div className="mt-1 mb-3">
          <StarRating rating={product.rating} />
        </div>

        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto pt-3 flex items-end justify-between border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-lg text-gray-900">
                ${product.discountPrice.toFixed(2)}
              </span>
              {/* <span className="text-xs font-medium text-red-500">
                Save $
                {(product.originalPrice - product.discountPrice).toFixed(2)}
              </span> */}
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product.id)}
            className={`flex items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm ${
              product.inCart
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            <ShoppingCart size={16} />
            <span className="text-xs font-medium">
              {product.inCart ? "Added" : "Add"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Carousel Component
const ProductTwo = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState(4);
  const carouselRef = useRef<HTMLDivElement>(null);

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
    setCurrentIndex((prev) =>
      prev + 1 >= products.length - visibleProducts + 1 ? 0 : prev + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev - 1 < 0 ? Math.max(0, products.length - visibleProducts) : prev - 1
    );
  };

  // Toggle product as favorite
  const toggleFavorite = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  };

  // Add product to cart
  const addToCart = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, inCart: !p.inCart } : p))
    );
  };

  // Calculate displayed products


  // Auto scroll function
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, products.length, visibleProducts]);

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
      </div>

      <div className="relative overflow-hidden" ref={carouselRef}>
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${
              currentIndex * (100 / visibleProducts)
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
                onFavoriteToggle={toggleFavorite}
                onAddToCart={addToCart}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({
          length: Math.min(products.length - visibleProducts + 1, 8),
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

      {/* View all button */}
      <div className="flex justify-center mt-8">
        <button className="px-6 py-2 border-2 border-gray-900 text-gray-900 font-medium rounded-lg hover:bg-gray-900 hover:text-white transition-colors duration-300">
          View All Sales
        </button>
      </div>
    </div>
  );
};

export default ProductTwo;

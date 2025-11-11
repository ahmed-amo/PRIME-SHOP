"use client"
import React, { useState } from "react";
import {
  Search,
  Grid,
  List,
  ChevronDown,
  Heart,
  ShoppingCart,
  Sliders,
} from "lucide-react";

// Product type definition
type Product = {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  category: string;
  rating: number;
  favorite?: boolean;
  isNew?: boolean;
  tags?: string[];
};

// Sample product data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Premium Leather Weekender Bag",
    price: 249.99,
    discountPrice: 199.99,
    description:
      "Handcrafted full-grain leather travel bag with brass hardware and cotton lining",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Travel",
    rating: 4.8,
    tags: ["Leather", "Handcrafted", "Premium"],
    isNew: true,
  },
  {
    id: "2",
    name: "Limited Edition Mechanical Watch",
    price: 899.99,
    discountPrice: 749.99,
    description:
      "Swiss-made automatic movement with sapphire crystal and exhibition caseback",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Watches",
    rating: 4.9,
    tags: ["Limited Edition", "Luxury", "Swiss-made"],
  },
  {
    id: "3",
    name: "Noise-Cancelling Wireless Headphones",
    price: 349.99,
    discountPrice: 299.99,
    description:
      "Studio-quality sound with adaptive noise cancellation and 30-hour battery life",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Electronics",
    rating: 4.7,
    tags: ["Wireless", "Noise-Cancelling", "Hi-Fi"],
  },
  {
    id: "4",
    name: "Italian Wool Tailored Blazer",
    price: 499.99,
    description:
      "Slim-fit blazer crafted from premium Italian wool with half-canvas construction",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Clothing",
    rating: 4.6,
    tags: ["Italian", "Tailored", "Formal"],
  },
  {
    id: "5",
    name: "Smart Home Security System",
    price: 399.99,
    discountPrice: 349.99,
    description:
      "4K cameras with night vision, two-way audio and AI-powered person detection",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579576542170-baeba2796f93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Electronics",
    rating: 4.8,
    tags: ["Smart Home", "Security", "AI"],
    isNew: true,
  },
  {
    id: "6",
    name: "Handmade Ceramic Dining Set",
    price: 279.99,
    description:
      "Artisanal 16-piece ceramic dining set with natural glazes, dishwasher safe",
    images: [
      "https://images.unsplash.com/photo-1565193298595-c89be36e4b8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574181609167-c580d243bad9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Home",
    rating: 4.5,
    tags: ["Handmade", "Ceramic", "Dining"],
  },
  {
    id: "7",
    name: "Professional Chef Knife Set",
    price: 329.99,
    discountPrice: 279.99,
    description:
      "Japanese steel knives with ergonomic handles and custom wooden block",
    images: [
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566454825481-4a11a81352a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Kitchen",
    rating: 4.9,
    tags: ["Professional", "Japanese Steel", "Kitchen"],
  },
  {
    id: "8",
    name: "Eco-friendly Yoga Mat",
    price: 89.99,
    description:
      "Non-slip, biodegradable yoga mat made from sustainably harvested natural rubber",
    images: [
      "https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Fitness",
    rating: 4.7,
    tags: ["Eco-friendly", "Yoga", "Non-slip"],
  },
];

// Categories for filtering
const categories = [
  "All Categories",
  "Travel",
  "Watches",
  "Electronics",
  "Clothing",
  "Home",
  "Kitchen",
  "Fitness",
];

// Star rating component
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
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
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

// Grid View Product Card
const GridProductCard: React.FC<{
  product: Product;
  onFavoriteToggle: (id: string) => void;
}> = ({ product, onFavoriteToggle }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageChange = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="group relative flex flex-col h-full rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image container with aspect ratio */}
      <div
        className="relative w-full pb-[100%] bg-gray-100 overflow-hidden cursor-pointer"
        onMouseEnter={() => product.images.length > 1 && handleImageChange()}
        onMouseLeave={() =>
          product.images.length > 1 && setCurrentImageIndex(0)
        }
      >
        {product.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${product.name} - view ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discountPrice && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md">
              SALE
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-md">
              NEW
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(product.id);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 shadow-sm"
          aria-label="Add to favorites"
        >
          <Heart
            size={18}
            className={
              product.favorite ? "fill-red-500 text-red-500" : "text-gray-700"
            }
          />
        </button>

        {/* Quick add to cart button */}
        <div className="absolute bottom-3 left-3 right-3 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button className="w-full flex items-center justify-center gap-2 py-2 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-md transition-colors duration-200">
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Product details */}
      <div className="flex flex-col p-4">
        <div className="mb-1.5">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="text-base font-medium text-gray-900 line-clamp-1 mt-1">
            {product.name}
          </h3>
        </div>

        <div className="mb-2">
          <StarRating rating={product.rating} />
        </div>

        <div className="mt-auto pt-2 flex items-baseline">
          {product.discountPrice ? (
            <>
              <span className="font-bold text-lg text-gray-900">
                ${product.discountPrice.toFixed(2)}
              </span>
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-bold text-lg text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// List View Product Card
const ListProductCard: React.FC<{
  product: Product;
  onFavoriteToggle: (id: string) => void;
}> = ({ product, onFavoriteToggle }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageChange = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="group relative flex flex-col sm:flex-row h-full rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image container */}
      <div
        className="relative w-full sm:w-48 md:w-56 lg:w-64 h-48 sm:h-auto bg-gray-100 overflow-hidden cursor-pointer"
        onMouseEnter={() => product.images.length > 1 && handleImageChange()}
        onMouseLeave={() =>
          product.images.length > 1 && setCurrentImageIndex(0)
        }
      >
        {product.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${product.name} - view ${index + 1}`}
            className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discountPrice && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md">
              SALE
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-md">
              NEW
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(product.id);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 shadow-sm"
          aria-label="Add to favorites"
        >
          <Heart
            size={18}
            className={
              product.favorite ? "fill-red-500 text-red-500" : "text-gray-700"
            }
          />
        </button>
      </div>

      {/* Product details */}
      <div className="flex flex-col p-4 flex-grow">
        <div className="mb-1.5 flex justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {product.category}
            </span>
            <h3 className="text-lg font-medium text-gray-900 mt-1">
              {product.name}
            </h3>
          </div>
          <div className="flex flex-col items-end">
            {product.discountPrice ? (
              <>
                <span className="font-bold text-lg text-gray-900">
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-bold text-lg text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="mb-3">
          <StarRating rating={product.rating} />
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 mb-4">
          {product.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-md transition-colors duration-200">
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
          <button className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md transition-colors duration-200">
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
};

// Main component
const ProductThree = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Toggle product as favorite
  const toggleFavorite = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  };

  // Filter products based on category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && (searchQuery === "" || matchesSearch);
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      case "price-high":
        return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return a.isNew ? -1 : b.isNew ? 1 : 0;
      default: // 'featured'
        return 0;
    }
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <path
                fill="white"
                d="M0,0 L100,0 L100,100 L80,100 C60,100 40,60 20,80 L0,100 Z"
              ></path>
            </svg>
          </div>
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Discover Premium Products
            </h1>
            <p className="text-gray-200 mb-6">
              Explore our curated collection of high-quality items, crafted for
              those who appreciate exceptional design and superior
              functionality.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full py-3 pl-4 pr-12 rounded-xl bg-white/90 backdrop-blur text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Category filter */}
          <div className="relative w-48">
            <select
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={16}
            />
          </div>

          {/* Sort by */}
          <div className="relative w-48">
            <select
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={16}
            />
          </div>

          {/* Filter button */}
          <button className="flex items-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200">
            <Sliders size={16} />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">
              {sortedProducts.length}
            </span>{" "}
            products
          </div>

          {/* View toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Product grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <GridProductCard
              key={product.id}
              product={product}
              onFavoriteToggle={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {sortedProducts.map((product) => (
            <ListProductCard
              key={product.id}
              product={product}
              onFavoriteToggle={toggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {sortedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 max-w-md">
            We couldn't find any products matching your filters. Try adjusting
            your search criteria or browse our categories.
          </p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Previous
          </button>
          <button className="px-3 py-1 bg-gray-900 text-white rounded-md hover:bg-black">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            3
          </button>
          <span className="px-2 text-gray-500">...</span>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            8
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductThree;

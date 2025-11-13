"use client";
import React, { useMemo, useState } from "react";
import { Search, Grid, List, ChevronDown, ShoppingCart } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Product } from "@/types/products";

export default function ShopProducts({ products }: { products: Product[] | { data: Product[] } }) {
  // Handle both paginated or plain arrays
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const productList: Product[] = Array.isArray(products) ? products : products?.data || [];

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const filtered = useMemo(() => {
    return productList.filter((p) => {
      const matchesCategory =
        selectedCategory === "All Categories" || p.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [productList, selectedCategory, searchQuery]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    switch (sortBy) {
      case "price-low":
        copy.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        copy.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }
    return copy;
  }, [filtered, sortBy]);

  const placeholder = "/placeholder.jpg";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 relative bg-gradient-to-r from-orange-600 via-orange-500 to-blue-600 rounded-2xl p-8 overflow-hidden shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Discover Premium Products
        </h1>
        <p className="text-lg text-orange-100 mb-8">
          Explore our curated collection of high-quality items.
        </p>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full py-4 pl-12 pr-16 rounded-xl bg-white text-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-600"
            size={24}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <div className="relative w-48">
            <select
              className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-gray-700"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All Categories">All Categories</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={16}
            />
          </div>

          <div className="relative w-48">
            <select
              className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-gray-700"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={16}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className={`p-2 rounded-md border ${
              viewMode === "grid"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setViewMode("grid")}
          >
            <Grid size={18} />
          </button>
          <button
            className={`p-2 rounded-md border ${
              viewMode === "list"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setViewMode("list")}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "flex flex-col gap-6"
        }
      >
        {sorted.map((product) => (
          <div key={product.id} className="bg-white shadow rounded-xl overflow-hidden p-4">
            <img
              src={product.image_url ?? placeholder}
              alt={product.name}
              className="w-full h-56 object-cover rounded-md mb-3"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.src = placeholder;
              }}
            />
            <h3 className="text-lg font-medium text-gray-800 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/product/${product.slug ?? product.id}`}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  View
                </Link>
                <button className="flex items-center gap-2 bg-orange-500 text-white px-3 py-2 rounded-md hover:bg-orange-600 transition">
                  <ShoppingCart size={16} /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <Search size={32} className="text-orange-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 max-w-md">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
}

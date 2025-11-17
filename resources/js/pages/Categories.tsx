"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, ArrowRight, Zap,} from "lucide-react";
import ShopFrontLayout from "@/layouts/shop-layout";
import { Category } from "@/types/categories";
import { Link } from "@inertiajs/react";

interface Props {
  categories: Category[];
}

const getImageUrl = (url?: string) =>
  url ?? "https://via.placeholder.com/800?text=No+Image";

export default function Categories({ categories }: Props) {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => setIsVisible(true), []);

  return (
    <ShopFrontLayout>
      <div className="w-full py-12 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Here are our Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of premium products across various
              categories
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, idx) => {
              const colSpan =
                category.size === "large"
                  ? "md:col-span-2 md:row-span-2"
                  : category.size === "medium"
                  ? "md:col-span-1 md:row-span-2"
                  : "";

              const overlayColor = category.color
                ? `from-${category.color.split('-')[1] || 'gray'}-900/80 to-${category.color.split('-')[1] || 'gray'}-700/80`
                : "from-gray-900/90 via-gray-800/70 to-transparent";

              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 group ${colSpan}`}
                  style={{
                    transform: isVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: isVisible ? 1 : 0,
                    transition: "all 0.7s ease",
                    transitionDelay: `${idx * 0.05}s`,
                  }}
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {/* Image */}
                  <div
                    className={`w-full h-full ${
                      category.size === "small" ? "aspect-square" : "aspect-auto"
                    }`}
                  >
                    <img
                      src={category.image_url || getImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${overlayColor} transition-opacity duration-300 ${
                      hoveredCategory === category.id ? "opacity-95" : "opacity-85"
                    }`}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-2">
                        {category.status === "new" && (
                          <div className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center">
                            <Zap className="w-3 h-3 mr-1" /> NEW
                          </div>
                        )}
                        {category.status === "hot" && (
                          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" /> HOT
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="transform group-hover:-translate-y-1 transition-transform duration-300">
                      <h3
                        className={`text-white font-bold ${
                          category.size === "large"
                            ? "text-3xl"
                            : category.size === "medium"
                            ? "text-2xl"
                            : "text-xl"
                        } mb-2`}
                      >
                        {category.name}
                      </h3>

                      {category.description && (
                        <p className="text-white/80 text-sm mb-3 line-clamp-2">
                          {category.description}
                        </p>
                      )}

                      <div className="h-0.5 w-0 bg-white group-hover:w-1/3 transition-all duration-500 ease-out" />

                      {(category.size === "large" || category.size === "medium") && (
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="inline-flex items-center text-white text-sm font-medium">
                            Explore Category
                            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </ShopFrontLayout>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, ArrowRight, Zap, Tag } from "lucide-react";

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  image: string;
  size?: "small" | "medium" | "large";
  discount?: string;
  overlayColor?: string;
  isNew?: boolean;
  isHot?: boolean;
  caption?: string;
}

export default function CategoryFour() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Category data with size variations for bento layout
  const categories: CategoryItem[] = [
    {
      id: 1,
      name: "Electronics",
      slug: "electronics",
      image:
        "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      size: "large",
      isHot: true,
      overlayColor: "from-blue-900/80 to-blue-700/80",
      caption: "Latest Tech Gadgets",
    },
    {
      id: 2,
      name: "Smartphones",
      slug: "smartphones",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      size: "medium",
      overlayColor: "from-indigo-800/80 to-indigo-600/80",
    },
    {
      id: 3,
      name: "Laptops",
      slug: "laptops",
      image:
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      size: "small",
      discount: "UP TO 30% OFF",
    },
    {
      id: 4,
      name: "Headphones",
      slug: "headphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      size: "small",
      isNew: true,
      overlayColor: "from-amber-800/70 to-amber-600/70",
    },
    {
      id: 5,
      name: "Wearables",
      slug: "wearables",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      size: "medium",
      overlayColor: "from-teal-700/70 to-teal-500/70",
      caption: "Smart Watches & Fitness Trackers",
    },
    {
      id: 6,
      name: "Gaming",
      slug: "gaming",
      image:
        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      size: "medium",
      overlayColor: "from-purple-800/80 to-purple-600/80",
      caption: "Consoles & Accessories",
    },
    {
      id: 7,
      name: "Cameras",
      slug: "cameras",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      size: "small",
      overlayColor: "from-gray-800/80 to-gray-600/80",
    },
    {
      id: 8,
      name: "Home Theater",
      slug: "home-theater",
      image:
        "https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      size: "small",
      overlayColor: "from-blue-900/80 to-blue-700/80",
    },
    {
      id: 9,
      name: "Accessories",
      slug: "accessories",
      image:
        "https://images.unsplash.com/photo-1601524909162-ae8725290836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      size: "small",
      overlayColor: "from-emerald-800/80 to-emerald-600/80",
    },
  ];

  return (
    <div className="w-full py-12 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of premium products across various
            categories
          </p>
        </div>

        {/* Bento grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, idx) => {
            // Determine the grid span based on size
            const colSpan =
              category.size === "large"
                ? "md:col-span-2 md:row-span-2"
                : category.size === "medium"
                ? "md:col-span-1 md:row-span-2"
                : "";

            return (
              <a
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
                {/* Background image */}
                <div
                  className={`w-full h-full ${
                    category.size === "small" ? "aspect-square" : "aspect-auto"
                  }`}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    category.overlayColor ||
                    "from-gray-900/90 via-gray-800/70 to-transparent"
                  } transition-opacity duration-300 ${
                    hoveredCategory === category.id
                      ? "opacity-95"
                      : "opacity-85"
                  }`}
                ></div>

                {/* Category content */}
                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between">
                  <div>
                    {/* Badges and indicators */}
                    <div className="flex gap-2">
                      {category.isNew && (
                        <div className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center">
                          <Zap className="w-3 h-3 mr-1" /> NEW
                        </div>
                      )}

                      {category.isHot && (
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" /> TRENDING
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="transform group-hover:translate-y-[-4px] transition-transform duration-300">
                    {/* Category name with underline animation */}
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

                    {/* Optional caption */}
                    {category.caption && (
                      <p className="text-white/80 text-sm mb-3">
                        {category.caption}
                      </p>
                    )}

                    {/* Discount */}
                    {category.discount && (
                      <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-lg mt-2 mb-3">
                        <Tag className="w-3.5 h-3.5 inline mr-1.5" />{" "}
                        {category.discount}
                      </div>
                    )}

                    {/* Animated line */}
                    <div className="h-0.5 w-0 bg-white group-hover:w-1/3 transition-all duration-500 ease-out"></div>

                    {/* Explore button for larger tiles */}
                    {(category.size === "large" ||
                      category.size === "medium") && (
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="inline-flex items-center text-white text-sm font-medium">
                          Explore Category{" "}
                          <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

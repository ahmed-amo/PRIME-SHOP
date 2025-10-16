"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  image: string;
  color: string;
}

export default function CategoryOne() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [visibleItems, setVisibleItems] = useState(6);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Premium categories data
  const categories: CategoryItem[] = [
    {
      id: 1,
      name: "Beauty & Fragrance",
      slug: "beauty-fragrance",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      color: "bg-amber-50",
    },
    {
      id: 2,
      name: "Electronics",
      slug: "electronics",
      image:
        "https://images.unsplash.com/photo-166202691159-5558e9949346?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      color: "bg-gray-100",
    },
    {
      id: 3,
      name: "Health & Personal",
      slug: "health-personal",
      image:
        "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      color: "bg-sky-50",
    },
    {
      id: 4,
      name: "Men's Fashion",
      slug: "mens-fashion",
      image:
        "https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      color: "bg-blue-50",
    },
    {
      id: 5,
      name: "Sports & Outdoors",
      slug: "sports-outdoors",
      image:
        "https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      color: "bg-purple-50",
    },
    {
      id: 6,
      name: "Women's Fashion",
      slug: "womens-fashion",
      image:
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      color: "bg-indigo-50",
    },
    {
      id: 7,
      name: "Automotive",
      slug: "automotive",
      image:
        "https://images.unsplash.com/photo-1504215680853-026ed2a45def?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      color: "bg-blue-50",
    },
    {
      id: 8,
      name: "Health & Nutrition",
      slug: "health-nutrition",
      image:
        "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      color: "bg-sky-50",
    },
    {
      id: 9,
      name: "Kids Fashion",
      slug: "kids-fashion",
      image:
        "https://images.unsplash.com/photo-1543854608-fbb5c5c8a307?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      color: "bg-violet-50",
    },
    {
      id: 10,
      name: "Refurbished Department",
      slug: "refurbished",
      image:
        "https://images.unsplash.com/photo-1603706585128-8d096bea0021?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      color: "bg-blue-50",
    },
    {
      id: 11,
      name: "Stationary, Books & Media",
      slug: "stationary-books-media",
      image:
        "https://images.unsplash.com/photo-1599204606395-ede983886ce9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      color: "bg-amber-50",
    },
    {
      id: 12,
      name: "Baby",
      slug: "baby",
      image:
        "https://images.unsplash.com/photo-1586683086816-c674f6bb3c69?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      color: "bg-teal-50",
    },
  ];

  // Calculate visible items based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(3);
      } else if (window.innerWidth < 768) {
        setVisibleItems(4);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(5);
      } else if (window.innerWidth < 1280) {
        setVisibleItems(6);
      } else {
        setVisibleItems(8);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate maximum pages
  const totalPages = Math.ceil(categories.length / visibleItems);
  const maxIndex = totalPages - 1;

  // Navigation functions
  const goToNext = () => {
    if (sliding) return;
    setSliding(true);
    setActiveIndex((current) => (current === maxIndex ? 0 : current + 1));
    setTimeout(() => setSliding(false), 500);
  };

  const goToPrev = () => {
    if (sliding) return;
    setSliding(true);
    setActiveIndex((current) => (current === 0 ? maxIndex : current - 1));
    setTimeout(() => setSliding(false), 500);
  };

  const goToPage = (index: number) => {
    if (sliding || index === activeIndex) return;
    setSliding(true);
    setActiveIndex(index);
    setTimeout(() => setSliding(false), 500);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrev();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Calculate visible categories based on active index
  const visibleCategories = () => {
    const startIdx = activeIndex * visibleItems;
    return categories.slice(startIdx, startIdx + visibleItems);
  };

  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-amber-50/70 to-amber-50/30 py-8 px-4 md:px-8 relative border-y border-amber-100/50">
      <div className="max-w-7xl mx-auto">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-300/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div
          className={`flex items-center justify-between mb-8 transition-opacity duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div>
            <div className="flex items-center">
              <div className="w-1.5 h-8 bg-amber-500 rounded-full mr-3"></div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Shop by Category
              </h2>
            </div>
            <p className="text-gray-500 text-sm mt-1 ml-4">
              Explore our premium collections
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={goToPrev}
              disabled={sliding}
              className="p-2.5 rounded-full bg-white border border-amber-200 text-gray-600 hover:bg-amber-50 hover:border-amber-300 transition-all shadow-sm disabled:opacity-50 hover:scale-105 active:scale-95"
              aria-label="Previous categories"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              disabled={sliding}
              className="p-2.5 rounded-full bg-white border border-amber-200 text-gray-600 hover:bg-amber-50 hover:border-amber-300 transition-all shadow-sm disabled:opacity-50 hover:scale-105 active:scale-95"
              aria-label="Next categories"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories Carousel */}
        <div
          ref={carouselRef}
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`flex transition-transform duration-500 ease-in-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: `translateX(0%)`,
              width: "100%",
              transitionDelay: "0.2s",
            }}
          >
            <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
              {visibleCategories().map((category, idx) => (
                <a
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="flex flex-col items-center group"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    transition: "all 0.5s ease",
                    transitionDelay: `${idx * 0.05}s`,
                  }}
                >
                  <div
                    className={`w-full aspect-square rounded-full overflow-hidden ${
                      category.color
                    } p-1.5 ${
                      hoveredCategory === category.id
                        ? "shadow-md ring-2 ring-amber-300 ring-opacity-50"
                        : "shadow-sm"
                    } transition-all duration-300 transform ${
                      hoveredCategory === category.id ? "scale-105" : ""
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-black/10"></div>
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-amber-700 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Dot Navigation */}
        <div className="flex justify-center items-center space-x-3 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "w-10 bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm"
                  : "w-2.5 bg-gray-200 hover:bg-amber-200"
              }`}
              aria-label={`Go to page ${index + 1}`}
              aria-current={activeIndex === index ? "true" : "false"}
            />
          ))}
        </div>

        {/* View All Categories Button */}
        <div
          className={`flex justify-center mt-8 transition-opacity duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "0.4s" }}
        >
          <a
            href="/categories"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95"
          >
            <span className="font-medium">View All Categories</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

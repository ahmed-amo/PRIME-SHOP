"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, ArrowRight, Zap,} from "lucide-react";
import ShopFrontLayout from "@/layouts/shop-layout";
import { Category } from "@/types/categories";
import { Link } from "@inertiajs/react";
import { useI18n } from "@/lib/i18n";

interface Props {
  categories: Category[];
}

const getImageUrl = (url?: string) =>
  url ?? "https://via.placeholder.com/800?text=No+Image";

export default function Categories({ categories }: Props) {
  const { t } = useI18n();
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => setIsVisible(true), []);

  return (
    <ShopFrontLayout>
      <div className="w-full py-12 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              {t("Here are our Categories")}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              {t("Categories page subtitle")}
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
                  <div className="absolute inset-0 flex flex-col justify-between p-5 text-start md:p-6">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {category.status === "new" && (
                          <div className="flex items-center gap-1 rounded-full bg-green-600 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                            <Zap className="h-3 w-3" /> {t("NEW")}
                          </div>
                        )}
                        {category.status === "hot" && (
                          <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                            <TrendingUp className="h-3 w-3" /> {t("HOT")}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                      <h3
                        className={`mb-2 font-bold text-white ${
                          category.size === "large"
                            ? "text-3xl"
                            : category.size === "medium"
                            ? "text-2xl"
                            : "text-xl"
                        }`}
                      >
                        {category.name}
                      </h3>

                      {category.description && (
                        <p className="mb-3 line-clamp-2 text-sm text-white/80">
                          {category.description}
                        </p>
                      )}

                      <div className="h-0.5 w-0 bg-white transition-all duration-500 ease-out group-hover:w-1/3 rtl:group-hover:origin-right" />

                      {(category.size === "large" || category.size === "medium") && (
                        <div className="mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white rtl:flex-row-reverse">
                            {t("Explore Category")}
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
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

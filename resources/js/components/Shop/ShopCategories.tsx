import React, { useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { Category } from "@/types/categories";
import { useI18n } from "@/lib/i18n";

export default function ShopCategories({ categories = [] }: { categories?: Category[] }) {
  const { t } = useI18n();
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getCategoryImage = (category: Category) => {
    if (category.image_url) return category.image_url;
    if (category.image) {
      if (category.image.startsWith("http://") || category.image.startsWith("https://")) return category.image;
      if (category.image.startsWith("catpics/")) return `/${category.image}`;
      return category.image.startsWith("/") ? category.image : `/storage/${category.image}`;
    }
    return "/placeholder.jpg";
  };

  return (
    <>
      <style>{`
@keyframes catFadeUp {
  from { opacity: 0; transform: translateY(26px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0px)  scale(1);    }
}

.cat-section .cat-header {
  opacity: 0;
}
.cat-section.visible .cat-header {
  animation: catFadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both;
}

.cat-section .cat-card {
  opacity: 0;
}

.cat-section.visible .cat-card {
  animation: catFadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--stagger);
}

.cat-section .cat-btn {
  opacity: 0;
}
.cat-section.visible .cat-btn {
  animation: catFadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both;
}
      `}</style>
      <section
        ref={sectionRef}
        className="cat-section w-full border-y border-zinc-200/80 bg-gradient-to-b from-zinc-50 to-white py-5 md:py-7"
      >
        {/* Match home banner horizontal rhythm; widen inner content so more columns fit in first view */}
        <div className="mx-auto w-full max-w-[1920px] px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="cat-header mb-5 flex flex-col items-center gap-3 text-center sm:mb-6 sm:gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{t("Browse")}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
                {t("Shop by category")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 md:text-base">
                {t("Shop categories subtitle")}
              </p>
            </div>
          </div>

          <div>
            {/* Flex + justify-center so short rows sit in the middle; fixed tile widths keep density similar to the old grid */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-4 xl:gap-5 2xl:gap-5">
              {categories.map((category, idx) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="cat-card group flex w-[calc((100%-0.75rem)/2)] max-w-[11rem] shrink-0 flex-col rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 sm:w-[calc((100%-2rem)/3)] sm:max-w-[12rem] md:w-[calc((100%-3.75rem)/4)] md:max-w-[13rem] lg:w-28 lg:max-w-none xl:w-32 2xl:w-36"
                  style={
                    { "--stagger": `${Math.min(idx, 10) * 0.06 + 0.1}s` } as React.CSSProperties
                  }
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div
                    className={`relative w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-sm ring-1 ring-zinc-900/5 transition duration-300 ${
                      hoveredCategory === category.id ? "shadow-md ring-zinc-900/10" : ""
                    }`}
                  >
                    <div className="aspect-square w-full">
                      <img
                        src={getCategoryImage(category)}
                        alt={category.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.jpg";
                        }}
                      />
                    </div>
                    {category.color ? (
                      <div
                        className="absolute bottom-0 start-0 end-0 h-1 opacity-90"
                        style={{ backgroundColor: category.color }}
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  <div className="mt-2.5 px-0.5 sm:mt-3">
                    <h3
                      className={`text-center text-xs font-medium leading-snug text-zinc-900 transition-colors sm:text-sm md:text-base ${
                        hoveredCategory === category.id ? "text-orange-700" : ""
                      }`}
                    >
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="cat-btn mt-5 flex justify-center sm:mt-6">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-2.5 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 rtl:flex-row-reverse"
            >
              {t("View all categories")}
              <ChevronRight className="h-4 w-4 text-zinc-500 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

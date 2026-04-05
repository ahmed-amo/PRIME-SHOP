import { useState, useEffect, useCallback, useRef, JSX } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motionVariants";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { useI18n } from "@/lib/i18n";

export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  secondaryButtonText?: string;
  buttonLink: string;
  secondaryButtonLink?: string;
  imageSrc: string;
  mobileImageSrc?: string;
  textColor: string;
  overlayColor: string;
  alignment?: "left" | "right" | "center";
  badge?: string;
  price?: string;
  originalPrice?: string;
  discount?: number;
}

const defaultCarouselData: CarouselSlide[] = [
  {
    id: 1,
    title: "Our Newest & Trendy Shoes Collection",
    subtitle: "Discover Your Own Shoes",
    description:
      "Step into style with our latest footwear designs. Premium comfort meets contemporary fashion. Handcrafted with the finest materials for lasting quality.",
    buttonText: "Shop products",
    secondaryButtonText: "Browse categories",
    buttonLink: "/products",
    secondaryButtonLink: "/categories",
    imageSrc:
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    mobileImageSrc:
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    textColor: "text-gray-900",
    overlayColor: "from-white/80 to-white/40",
    alignment: "left",
    badge: "NEW ARRIVAL",
    price: "299 DA",
    originalPrice: "399 DA",
    discount: 25,
  },
  {
    id: 2,
    title: "Elegant Watches For Every Occasion",
    subtitle: "Timeless Elegance",
    description:
      "Precision craftsmanship and sophisticated design. Our watches make a statement without saying a word. Each timepiece represents generations of watchmaking expertise.",
    buttonText: "Shop products",
    secondaryButtonText: "Browse categories",
    buttonLink: "/products",
    secondaryButtonLink: "/categories",
    imageSrc:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80",
    mobileImageSrc:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    textColor: "text-gray-900",
    overlayColor: "from-gray-100/80 to-gray-50/60",
    alignment: "right",
    badge: "PREMIUM",
    price: "1 299 DA",
    originalPrice: "1 499 DA",
    discount: 13,
  },
  {
    id: 3,
    title: "Premium Bags & Accessories",
    subtitle: "Carry Your Style",
    description:
      "Handcrafted with premium materials. Our bags combine functionality with uncompromising style. Designed for those who appreciate the finest details and superior quality.",
    buttonText: "Shop products",
    secondaryButtonText: "Browse categories",
    buttonLink: "/products",
    secondaryButtonLink: "/categories",
    imageSrc:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=876&q=80",
    mobileImageSrc:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    textColor: "text-gray-900",
    overlayColor: "from-amber-50/70 to-white/40",
    alignment: "left",
    badge: "EXCLUSIVE",
    price: "899 DA",
    originalPrice: "1 199 DA",
    discount: 25,
  },
];

export type ShopBannerProps = {
  slides?: CarouselSlide[];
};

export default function BannerOne({ slides }: ShopBannerProps): JSX.Element {
  const { t, direction } = useI18n();
  const isRtl = direction === "rtl";
  const carouselData = slides && slides.length > 0 ? slides : defaultCarouselData;

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const slideCount: number = carouselData.length;
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const slideDuration = 8000;
  const animationDuration = 700;

  useEffect(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    if (!isHovering) {
      progressRef.current = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 100 / (slideDuration / 100)));
      }, 100);
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [currentSlide, isHovering, slideDuration]);

  const goToSlide = useCallback(
    (index: number): void => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), animationDuration);
    },
    [isAnimating],
  );

  const goToPrevSlide = useCallback((): void => {
    goToSlide((currentSlide - 1 + slideCount) % slideCount);
  }, [currentSlide, goToSlide, slideCount]);

  const goToNextSlide = useCallback((): void => {
    goToSlide((currentSlide + 1) % slideCount);
  }, [currentSlide, goToSlide, slideCount]);

  useEffect(() => {
    if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    if (!isHovering && !isAnimating) {
      autoPlayRef.current = setTimeout(() => goToNextSlide(), slideDuration);
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [currentSlide, isAnimating, isHovering, goToNextSlide, slideDuration]);

  const slide = carouselData[currentSlide];

  return (
    <motion.section
      className="relative my-2 w-full overflow-hidden rounded-lg sm:my-4 sm:rounded-xl md:my-8 md:rounded-2xl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      variants={fadeUp}
      initial="initial"
      animate="animate"
    >
      {/* ─── MOBILE LAYOUT (below md) ─── */}
      <div className="block md:hidden">
        {carouselData.map((s, index) => (
          <div
            key={s.id}
            className={`transition-all duration-700 ${
              currentSlide === index ? "block" : "hidden"
            }`}
          >
            {/* Image section */}
            <div className="relative h-52 w-full overflow-hidden sm:h-64">
              <picture>
                <source media="(max-width: 640px)" srcSet={s.mobileImageSrc ?? s.imageSrc} />
                <img
                  src={s.imageSrc}
                  alt={s.title}
                  className="h-full w-full object-cover object-center"
                />
              </picture>
              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />

              {/* Badge */}
              {s.badge && (
                <div className="absolute top-3 start-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-bold tracking-wider text-white">{s.badge}</span>
                </div>
              )}

              {/* Slide counter */}
              <div className="absolute bottom-3 end-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {index + 1} / {slideCount}
              </div>

              {/* Prev arrow */}
              <button
                type="button"
                onClick={isRtl ? goToNextSlide : goToPrevSlide}
                className="absolute start-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-white/60 bg-white/40 text-gray-800 backdrop-blur-sm transition hover:bg-white focus:outline-none"
                aria-label={t("Previous slide")}
              >
                {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>

              {/* Next arrow */}
              <button
                type="button"
                onClick={isRtl ? goToPrevSlide : goToNextSlide}
                className="absolute end-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-white/60 bg-white/40 text-gray-800 backdrop-blur-sm transition hover:bg-white focus:outline-none"
                aria-label={t("Next slide")}
              >
                {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>

            {/* Content section */}
            <div className="bg-white px-4 py-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                {s.subtitle}
              </p>
              <h2 className="mb-2 text-lg font-bold leading-snug text-gray-900">
                {s.title}
              </h2>

              {s.price && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">{s.price}</span>
                  {s.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{s.originalPrice}</span>
                  )}
                  {s.discount != null && s.discount > 0 && (
                    <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      SAVE {s.discount}%
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  asChild
                  className="flex h-10 flex-1 touch-manipulation items-center justify-center gap-2 rounded-full bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 rtl:flex-row-reverse"
                >
                  <Link href={s.buttonLink}>
                    <ShoppingBag className="h-4 w-4 shrink-0" />
                    {s.buttonText}
                  </Link>
                </Button>
                {s.secondaryButtonText && s.secondaryButtonLink && (
                  <Button
                    asChild
                    variant="outline"
                    className="flex h-10 flex-1 touch-manipulation items-center justify-center gap-1.5 rounded-full border-gray-300 bg-gray-50 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 rtl:flex-row-reverse"
                  >
                    <Link href={s.secondaryButtonLink}>
                      {s.secondaryButtonText}
                      <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-1.5 bg-white pb-3">
              {carouselData.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                    currentSlide === i ? "w-6 bg-blue-600" : "w-1.5 bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ─── DESKTOP LAYOUT (md and above) — unchanged from original ─── */}
      <div className="hidden md:block">
        <div className="relative h-[min(85dvh,720px)] max-h-[800px] min-h-[520px] w-full lg:min-h-[560px]">
          <div className="absolute inset-0 h-full w-full">
            {carouselData.map((s, index) => (
              <div
                key={s.id}
                className={`absolute inset-0 h-full w-full transition-all duration-700 ease-in-out ${
                  currentSlide === index ? "z-10 scale-100 opacity-100" : "z-0 scale-105 opacity-0"
                }`}
              >
                <div className="absolute inset-0 h-full w-full">
                  <picture>
                    <img
                      src={s.imageSrc}
                      alt={s.title}
                      className="h-full w-full object-cover object-center"
                      sizes="100vw"
                    />
                  </picture>
                  <div className={`absolute inset-0 bg-gradient-to-r ${s.overlayColor} backdrop-blur-[2px]`} />
                </div>

                <div className="relative z-10 h-full w-full">
                  <div className="mx-auto flex h-full w-full max-w-7xl items-center px-8">
                    <div
                      className={`w-full max-w-xl lg:w-1/2 ${
                        s.alignment === "right"
                          ? "ms-auto me-0"
                          : s.alignment === "center"
                            ? "mx-auto text-center"
                            : "me-auto ms-0"
                      }`}
                    >
                      <div className="rounded-2xl border border-white/50 bg-white/35 p-8 text-start shadow-xl backdrop-blur-sm lg:p-10">
                        {s.badge && (
                          <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold tracking-wider text-white">{s.badge}</span>
                          </div>
                        )}

                        <span className="mb-2 inline-block px-4 text-sm font-medium uppercase tracking-wider text-blue-700">
                          {s.subtitle}
                        </span>

                        <h2 className={`mb-4 text-4xl font-bold leading-snug lg:text-5xl ${s.textColor}`}>
                          {s.title}
                        </h2>

                        <p className={`mb-6 text-lg leading-relaxed ${s.textColor.replace("900", "700")}`}>
                          {s.description}
                        </p>

                        {s.price && (
                          <div className="mb-6 inline-block rounded-lg bg-black/10 px-4 py-2 backdrop-blur-sm">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-2xl font-bold text-gray-900">{s.price}</span>
                              {s.originalPrice && (
                                <span className="text-base text-gray-500 line-through">{s.originalPrice}</span>
                              )}
                              {s.discount != null && s.discount > 0 && (
                                <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                                  SAVE {s.discount}%
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex w-auto flex-row flex-wrap gap-4">
                          <Button
                            asChild
                            className="flex h-12 touch-manipulation items-center justify-center gap-2 rounded-full bg-blue-700 px-8 text-base font-medium text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl rtl:flex-row-reverse"
                          >
                            <Link href={s.buttonLink}>
                              <ShoppingBag className="h-4 w-4 shrink-0" />
                              {s.buttonText}
                            </Link>
                          </Button>

                          {s.secondaryButtonText && s.secondaryButtonLink && (
                            <Button
                              asChild
                              variant="outline"
                              className="flex h-12 touch-manipulation items-center justify-center gap-2 rounded-full border-gray-400 bg-white/50 px-6 text-base font-medium text-gray-800 transition-all duration-300 hover:bg-white/80 rtl:flex-row-reverse"
                            >
                              <Link href={s.secondaryButtonLink}>
                                {s.secondaryButtonText}
                                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop prev arrow */}
          <button
            type="button"
            onClick={isRtl ? goToNextSlide : goToPrevSlide}
            className="absolute start-8 top-1/2 z-20 flex min-h-14 min-w-14 -translate-y-1/2 touch-manipulation cursor-pointer items-center justify-center rounded-full border border-white/60 bg-white/40 p-4 text-gray-800 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t("Previous slide")}
          >
            {isRtl ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
          </button>

          {/* Desktop next arrow */}
          <button
            type="button"
            onClick={isRtl ? goToPrevSlide : goToNextSlide}
            className="absolute end-8 top-1/2 z-20 flex min-h-14 min-w-14 -translate-y-1/2 touch-manipulation cursor-pointer items-center justify-center rounded-full border border-white/60 bg-white/40 p-4 text-gray-800 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t("Next slide")}
          >
            {isRtl ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
          </button>

          {/* Desktop dot indicators + progress */}
          <div className="absolute bottom-8 start-0 end-0 z-20 flex justify-center px-4">
            <div className="flex items-center justify-center gap-4 rounded-full border border-white/20 bg-black/25 px-4 py-3 shadow-lg backdrop-blur-md">
              <div className="text-sm font-medium text-white">
                <span className="text-base font-bold">{currentSlide + 1}</span>
                <span className="mx-1">/</span>
                <span>{slideCount}</span>
              </div>
              <div className="flex gap-3">
                {carouselData.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`h-2 cursor-pointer rounded-full transition-all duration-300 focus:outline-none ${
                      currentSlide === index ? "w-8 bg-blue-600" : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={currentSlide === index ? "true" : "false"}
                  />
                ))}
              </div>
              <div className="h-1 w-24 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
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

  return (
    <motion.section
      className="relative my-2 h-[min(68dvh,420px)] w-full min-h-[280px] overflow-hidden rounded-lg sm:my-4 sm:h-[400px] sm:min-h-0 sm:rounded-xl md:my-8 md:h-[min(85dvh,720px)] md:max-h-[800px] md:min-h-[520px] md:rounded-2xl lg:min-h-[560px]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      variants={fadeUp}
      initial="initial"
      animate="animate"
    >
      <div className="absolute inset-0 h-full w-full">
        {carouselData.map((slide: CarouselSlide, index: number) => (
          <div
            key={slide.id}
            className={`absolute inset-0 h-full w-full transition-all duration-700 ease-in-out ${
              currentSlide === index ? "z-10 scale-100 opacity-100" : "z-0 scale-105 opacity-0"
            }`}
          >
            <div className="absolute inset-0 h-full w-full">
              <picture>
                <source media="(max-width: 640px)" srcSet={slide.mobileImageSrc ?? slide.imageSrc} />
                <img
                  src={slide.imageSrc}
                  alt={slide.title}
                  className="h-full w-full object-cover object-center"
                  sizes="100vw"
                />
              </picture>
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.overlayColor} backdrop-blur-[2px]`}
              />
            </div>

            <div className="relative z-10 h-full w-full">
              <div className="mx-auto flex h-full w-full max-w-7xl items-center px-3 sm:px-4 md:px-8">
                <div
                  className={`w-full max-w-xl lg:w-1/2 ${
                    slide.alignment === "right"
                      ? "ms-auto me-0"
                      : slide.alignment === "center"
                        ? "mx-auto text-center"
                        : "me-auto ms-0"
                  }`}
                >
                  <div className="rounded-xl border border-white/50 bg-white/35 p-3 text-start shadow-xl backdrop-blur-sm sm:bg-white/30 sm:p-4 md:rounded-2xl md:p-8 lg:p-10">
                    {slide.badge && (
                      <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 sm:mb-4 sm:px-3 sm:py-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold tracking-wider text-white">{slide.badge}</span>
                      </div>
                    )}

                    <span className="mb-1 inline-block px-0 text-xs font-medium uppercase tracking-wider text-blue-700 sm:mb-2 sm:px-4 sm:text-sm">
                      {slide.subtitle}
                    </span>

                    <h2
                      className={`mb-2 text-xl font-bold leading-snug sm:mb-3 sm:text-2xl md:mb-4 md:text-4xl lg:text-5xl ${slide.textColor}`}
                    >
                      {slide.title}
                    </h2>

                    <p
                      className={`mb-3 line-clamp-3 text-sm leading-relaxed sm:line-clamp-none sm:text-base md:mb-6 md:text-lg ${slide.textColor.replace("900", "700")}`}
                    >
                      {slide.description}
                    </p>

                    {slide.price && (
                      <div className="mb-4 inline-block rounded-lg bg-black/10 px-3 py-1.5 backdrop-blur-sm sm:mb-6 sm:px-4 sm:py-2">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <span className="text-xl font-bold text-gray-900 sm:text-2xl">{slide.price}</span>
                          {slide.originalPrice && (
                            <span className="text-base text-gray-500 line-through">{slide.originalPrice}</span>
                          )}
                          {slide.discount != null && slide.discount > 0 && (
                            <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                              SAVE {slide.discount}%
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
                      <Button
                        asChild
                        className="flex h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-blue-700 px-6 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:bg-blue-800 hover:shadow-xl sm:h-12 sm:w-auto sm:px-8 sm:text-base rtl:flex-row-reverse"
                      >
                        <Link href={slide.buttonLink}>
                          <ShoppingBag className="h-4 w-4 shrink-0" />
                          {slide.buttonText}
                        </Link>
                      </Button>

                      {slide.secondaryButtonText && slide.secondaryButtonLink && (
                        <Button
                          asChild
                          variant="outline"
                          className="flex h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-full border-gray-400 bg-white/50 px-5 text-sm font-medium text-gray-800 transition-all duration-300 hover:bg-white/80 sm:h-12 sm:w-auto sm:px-6 sm:text-base rtl:flex-row-reverse"
                        >
                          <Link href={slide.secondaryButtonLink}>
                            {slide.secondaryButtonText}
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

      <button
        type="button"
        onClick={isRtl ? goToNextSlide : goToPrevSlide}
        className="absolute start-2 top-1/2 z-20 flex min-h-11 min-w-11 -translate-y-1/2 touch-manipulation cursor-pointer items-center justify-center rounded-full border border-white/60 bg-white/40 p-2 text-gray-800 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 sm:start-4 sm:p-3 md:start-8 md:min-h-14 md:min-w-14 md:p-4"
        aria-label={t("Previous slide")}
      >
        {isRtl ? (
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        ) : (
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        )}
      </button>

      <button
        type="button"
        onClick={isRtl ? goToPrevSlide : goToNextSlide}
        className="absolute end-2 top-1/2 z-20 flex min-h-11 min-w-11 -translate-y-1/2 touch-manipulation cursor-pointer items-center justify-center rounded-full border border-white/60 bg-white/40 p-2 text-gray-800 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 sm:end-4 sm:p-3 md:end-8 md:min-h-14 md:min-w-14 md:p-4"
        aria-label={t("Next slide")}
      >
        {isRtl ? (
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        ) : (
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        )}
      </button>

      <div className="absolute bottom-3 start-0 end-0 z-20 flex justify-center px-2 sm:bottom-6 sm:px-4 md:bottom-8">
        <div className="flex max-w-[calc(100vw-1rem)] flex-wrap items-center justify-center gap-2 rounded-full border border-white/20 bg-black/25 px-2.5 py-2 shadow-lg backdrop-blur-md sm:gap-3 sm:px-4 sm:py-3 md:gap-4">
          <div className="text-xs font-medium text-white sm:text-sm">
            <span className="text-sm font-bold sm:text-base">{currentSlide + 1}</span>
            <span className="mx-1">/</span>
            <span>{slideCount}</span>
          </div>
          <div className="flex max-w-full gap-1.5 overflow-x-auto sm:gap-3">
            {carouselData.map((_: CarouselSlide, index: number) => (
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
          <div className="hidden h-1 w-20 overflow-hidden rounded-full bg-white/20 sm:block sm:w-24">
            <div
              className="h-full rounded-full bg-blue-600 transition-all ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

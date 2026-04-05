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
      "Step into style with our latest footwear designs. Premium comfort meets contemporary fashion.",
    buttonText: "Shop products",
    secondaryButtonText: "Browse categories",
    buttonLink: "/products",
    secondaryButtonLink: "/categories",
    imageSrc: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1025&q=80",
    mobileImageSrc: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
    textColor: "text-gray-900",
    overlayColor: "from-white/90 via-white/40 to-transparent",
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
    description: "Precision craftsmanship and sophisticated design. Our watches make a statement.",
    buttonText: "Shop products",
    secondaryButtonText: "Browse categories",
    buttonLink: "/products",
    secondaryButtonLink: "/categories",
    imageSrc: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1180&q=80",
    mobileImageSrc: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80",
    textColor: "text-gray-900",
    overlayColor: "from-gray-100/90 via-gray-50/40 to-transparent",
    alignment: "right",
    badge: "PREMIUM",
    price: "1 299 DA",
    originalPrice: "1 499 DA",
    discount: 13,
  }
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
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [currentSlide, isHovering, slideDuration]);

  const goToSlide = useCallback((index: number): void => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), animationDuration);
  }, [isAnimating]);

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
    return () => { if (autoPlayRef.current) clearTimeout(autoPlayRef.current); };
  }, [currentSlide, isAnimating, isHovering, goToNextSlide]);

  return (
    <motion.section
      className="relative my-2 h-[520px] w-full overflow-hidden rounded-xl sm:my-4 sm:h-[400px] md:my-8 md:h-[600px] lg:h-[700px]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      variants={fadeUp}
      initial="initial"
      animate="animate"
    >
      <div className="absolute inset-0 h-full w-full">
        {carouselData.map((slide, index) => (
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
                  className="h-full w-full object-cover"
                />
              </picture>
              <div className={`absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 md:bg-gradient-to-r md:${slide.overlayColor}`} />
            </div>

            <div className="relative z-10 flex h-full w-full items-end pb-12 md:items-center md:pb-0">
              <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
                <div className={`w-full max-w-xl ${slide.alignment === "right" ? "ms-auto" : slide.alignment === "center" ? "mx-auto text-center" : "me-auto"}`}>
                  
                  <div className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-2xl backdrop-blur-md md:p-10">
                    {slide.badge && (
                      <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{slide.badge}</span>
                      </div>
                    )}

                    <h2 className="mb-2 text-2xl font-black leading-tight text-gray-900 md:text-5xl">
                      {slide.title}
                    </h2>

                    <p className="mb-4 line-clamp-2 text-sm text-gray-700 md:text-lg md:line-clamp-none">
                      {slide.description}
                    </p>

                    {slide.price && (
                      <div className="mb-5 flex items-center gap-3">
                        <span className="text-2xl font-bold text-blue-700">{slide.price}</span>
                        {slide.discount && (
                          <span className="rounded bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white">-{slide.discount}%</span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button asChild className="h-12 rounded-lg bg-blue-700 px-8 text-white hover:bg-blue-800">
                        <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                      </Button>
                      {slide.secondaryButtonText && (
                        <Button asChild variant="outline" className="h-12 rounded-lg border-gray-300 bg-white/50 hover:bg-white">
                          <Link href={slide.secondaryButtonLink || "#"}>{slide.secondaryButtonText}</Link>
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

      {/* Navigation - Hidden on tiny screens to avoid "ugly" overlap */}
      <div className="hidden sm:block">
        <button onClick={isRtl ? goToNextSlide : goToPrevSlide} className="absolute start-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/50 p-3 backdrop-blur-md hover:bg-white"><ChevronLeft /></button>
        <button onClick={isRtl ? goToPrevSlide : goToNextSlide} className="absolute end-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/50 p-3 backdrop-blur-md hover:bg-white"><ChevronRight /></button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {carouselData.map((_, i) => (
          <button key={i} onClick={() => goToSlide(i)} className={`h-1.5 rounded-full transition-all ${currentSlide === i ? "w-8 bg-blue-600" : "w-2 bg-white/50"}`} />
        ))}
      </div>
    </motion.section>
  );
}
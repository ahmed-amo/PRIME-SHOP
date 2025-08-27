
import { useState, useEffect, useCallback, useRef, JSX } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

// Enhanced types for carousel data
interface CarouselSlide {
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

// Enhanced carousel data with more premium features
const carouselData: CarouselSlide[] = [
  {
    id: 1,
    title: "Our Newest & Trendy Shoes Collection",
    subtitle: "Discover Your Own Shoes",
    description:
      "Step into style with our latest footwear designs. Premium comfort meets contemporary fashion. Handcrafted with the finest materials for lasting quality.",
    buttonText: "Shop Collection",
    secondaryButtonText: "View Lookbook",
    buttonLink: "/collections/shoes",
    secondaryButtonLink: "/lookbooks/shoes-2025",
    imageSrc:
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    textColor: "text-gray-900",
    overlayColor: "from-white/80 to-white/40",
    alignment: "left",
    badge: "NEW ARRIVAL",
    price: "$299",
    originalPrice: "$399",
    discount: 25,
  },
  {
    id: 2,
    title: "Elegant Watches For Every Occasion",
    subtitle: "Timeless Elegance",
    description:
      "Precision craftsmanship and sophisticated design. Our watches make a statement without saying a word. Each timepiece represents generations of watchmaking expertise.",
    buttonText: "View Collection",
    secondaryButtonText: "Learn More",
    buttonLink: "/collections/watches",
    secondaryButtonLink: "/about/craftsmanship",
    imageSrc:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80",
    textColor: "text-gray-900",
    overlayColor: "from-gray-100/80 to-gray-50/60",
    alignment: "right",
    badge: "PREMIUM",
    price: "$1,299",
    originalPrice: "$1,499",
    discount: 13,
  },
  {
    id: 3,
    title: "Premium Bags & Accessories",
    subtitle: "Carry Your Style",
    description:
      "Handcrafted with premium materials. Our bags combine functionality with uncompromising style. Designed for those who appreciate the finest details and superior quality.",
    buttonText: "Explore Collection",
    secondaryButtonText: "View Materials",
    buttonLink: "/collections/bags",
    secondaryButtonLink: "/materials/premium-leather",
    imageSrc:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=876&q=80",
    textColor: "text-gray-900",
    overlayColor: "from-amber-50/70 to-white/40",
    alignment: "left",
    badge: "EXCLUSIVE",
    price: "$899",
    originalPrice: "$1,199",
    discount: 25,
  },
];

export default function BannerOne(): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const slideCount: number = carouselData.length;
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const slideDuration = 8000; // 8 seconds per slide
  const animationDuration = 700; // 700ms for transitions

  // Reset timer when slide changes
  useEffect(() => {
    setProgress(0);

    if (progressRef.current) {
      clearInterval(progressRef.current);
    }

    if (!isHovering) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 100 / (slideDuration / 100);
        });
      }, 100);

      progressRef.current = interval;
    }

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [currentSlide, isHovering, slideDuration]);

  // Auto-advance the carousel
  useEffect(() => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }

    if (!isHovering && !isAnimating) {
      autoPlayRef.current = setTimeout(() => {
        goToNextSlide();
      }, slideDuration);
    }

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [currentSlide, isAnimating, isHovering]);

  // Navigation functions
  const goToSlide = useCallback(
    (index: number): void => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), animationDuration);
    },
    [isAnimating]
  );

  const goToPrevSlide = useCallback((): void => {
    const newIndex = (currentSlide - 1 + slideCount) % slideCount;
    goToSlide(newIndex);
  }, [currentSlide, goToSlide, slideCount]);

  const goToNextSlide = useCallback((): void => {
    const newIndex = (currentSlide + 1) % slideCount;
    goToSlide(newIndex);
  }, [currentSlide, goToSlide, slideCount]);

  return (
       <section
    className="my-8 relative w-full overflow-hidden h-screen max-h-[600px] min-h-[600px] rounded-2xl"
    onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
  >
      {/* Full-width image carousel */}
      <div className="absolute inset-0 w-full h-full">
        {carouselData.map((slide: CarouselSlide, index: number) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
              currentSlide === index
                ? "opacity-100 z-10 transform scale-100"
                : "opacity-0 z-0 transform scale-105"
            }`}
          >
            {/* Full-width background image */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={slide.imageSrc}
                alt={`${slide.title}`}
                className="w-full h-full object-cover object-center"
                sizes="100vw"
              />

              {/* Enhanced gradient overlay for better text readability */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.overlayColor} backdrop-blur-[2px]`}
              ></div>
            </div>

            {/* Content container */}
            <div className="relative h-full w-full z-10">
              <div className="container mx-auto h-full flex items-center px-4 md:px-8">
                {/* Text content with dynamic positioning */}
                <div
                  className={`w-full lg:w-1/2 max-w-xl ${
                    slide.alignment === "right"
                      ? "ml-auto mr-0"
                      : slide.alignment === "center"
                      ? "mx-auto text-center"
                      : "mr-auto ml-0"
                  }`}
                >
                  <div className="backdrop-blur-sm bg-white/30 p-6 md:p-8 lg:p-10 rounded-2xl shadow-xl border border-white/50">
                    {/* Badge */}
                    {slide.badge && (
                      <div className="inline-flex items-center gap-1 mb-4 px-3 py-1 bg-black/70 rounded-full">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold tracking-wider text-white">
                          {slide.badge}
                        </span>
                      </div>
                    )}

                    {/* Subtitle */}
                    <span className="inline-block mb-2 text-sm font-medium tracking-wider uppercase text-blue-700 px-4">
                      {slide.subtitle}
                    </span>

                    {/* Title */}
                    <h2
                      className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight ${slide.textColor}`}
                    >
                      {slide.title}
                    </h2>

                    {/* Description */}
                    <p
                      className={`mb-6 md:mb-8 text-base md:text-lg ${slide.textColor.replace(
                        "900",
                        "700"
                      )}`}
                    >
                      {slide.description}
                    </p>

                    {/* Price display if available */}
                    {slide.price && (
                      <div className="mb-6 inline-block bg-black/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-900">
                            {slide.price}
                          </span>
                          {slide.originalPrice && (
                            <span className="text-base line-through text-gray-500">
                              {slide.originalPrice}
                            </span>
                          )}
                          {slide.discount && (
                            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded font-bold">
                              SAVE {slide.discount}%
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <Button
                        asChild
                        className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-2 h-12 text-base rounded-full transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center"
                      >
                        <Link href={slide.buttonLink}>
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          {slide.buttonText}
                        </Link>
                      </Button>

                      {slide.secondaryButtonText &&
                        slide.secondaryButtonLink && (
                          <Button
                            asChild
                            variant="outline"
                            className="bg-white/50 border-gray-400 hover:bg-white/80 text-gray-800 px-6 py-2 h-12 text-base rounded-full transition-all duration-300 font-medium flex items-center"
                          >
                            <Link href={slide.secondaryButtonLink}>
                              {slide.secondaryButtonText}
                              <ArrowRight className="h-4 w-4 ml-2" />
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

      {/* Enhanced navigation arrows */}
      <button
        onClick={goToPrevSlide}
        className=" cursor-pointer absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white text-gray-800 p-3 md:p-4 rounded-full backdrop-blur-sm transition-all duration-300 border border-white/60 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 "
        aria-label="Previous slide"
        type="button"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      <button
        onClick={goToNextSlide}
        className=" cursor-pointer absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white text-gray-800 p-3 md:p-4 rounded-full backdrop-blur-sm transition-all duration-300 border border-white/60 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Next slide"
        type="button"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6 " />
      </button>

      {/* Enhanced slide indicators with progress */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center px-4">
        <div className="bg-black/20 backdrop-blur-md rounded-full px-4 py-3 shadow-lg border border-white/20 flex items-center gap-4">
          {/* Slide counter */}
          <div className="text-white font-medium text-sm">
            <span className="text-base font-bold">{currentSlide + 1}</span>
            <span className="mx-1">/</span>
            <span>{slideCount}</span>
          </div>

          {/* Slide indicators */}
          <div className="flex space-x-3">
            {carouselData.map((_: CarouselSlide, index: number) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all cursor-pointer duration-300 focus:outline-none ${
                  currentSlide === index
                    ? "bg-blue-600 w-8"
                    : "bg-white/50 hover:bg-white/80 w-2"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={currentSlide === index ? "true" : "false"}
                type="button"
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
    
  );
}

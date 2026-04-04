"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  Share2,
  ChevronRight,
} from "lucide-react";
import ShopFrontLayout from "@/layouts/shop-layout";
import { Product } from "@/types/products";
import { Category } from "@/types/categories";
import { Link, useForm, usePage } from "@inertiajs/react";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import ShopSales from "@/components/Shop/ShopSales";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useSaleCountdown } from "@/hooks/useSaleCountdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type SaleProductCard = {
  id: number;
  name: string;
  slug: string;
  originalPrice: number;
  price: number;
  discountPercentage: number;
  description: string;
  image_url: string | null;
  category: string | null;
  rating: number;
  stock: number;
};

interface Props {
  product: Product;
  category: Category | null;
  saleProducts?: SaleProductCard[];
}

const placeholder = "https://via.placeholder.com/800?text=No+Image";

export default function ProductDetail({ product, category, saleProducts = [] }: Props) {
  const { t, formatPrice, locale } = useI18n();
  const { flash, errors } = usePage().props as {
    flash?: { review_submitted?: boolean };
    errors?: { rating?: string };
  };
  const { auth } = usePage().props as { auth?: { user?: { id: number; name: string } | null } };
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const saleEndsLabel = useSaleCountdown(product.sale_ends_at);

  const reviewsList = product.reviews_list ?? [];
  const canReview = product.can_review === true;
  const userReview = product.user_review;

  const { data, setData, post, processing, reset } = useForm({
    rating: 5,
    body: "",
  });

  useEffect(() => {
    if (window.location.hash === "#reviews") {
      document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    if (flash?.review_submitted) {
      reset();
    }
  }, [flash?.review_submitted, reset]);

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("shop.reviews.store", product.slug), { preserveScroll: true });
  };

  const images = product.images && product.images.length > 0
    ? product.images.filter(Boolean)
    : [product.image_url || placeholder];

  return (
    <ShopFrontLayout>
      <div className="mx-auto max-w-7xl bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Breadcrumb - FIXED */}
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            {t("Home")}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 self-center text-gray-400 rtl:rotate-180" />

          {/* Fixed: Use category.slug and category.name */}
          {category ? (
            <>
              <Link
                href={`/category/${category.slug}`}
                className="text-gray-500 hover:text-gray-700"
              >
                {category.name}
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0 self-center text-gray-400 rtl:rotate-180" />
            </>
          ) : null}
          <span className="font-medium text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Product Images */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-md ring-1 ring-gray-200/80">
              {product.is_on_sale && (product.discount_percentage ?? 0) > 0 && (
                <span className="absolute start-3 top-3 z-10 rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                  {t("SALE")} −{product.discount_percentage}%
                </span>
              )}
              <img
                src={images[selectedImage]}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl transition-shadow ${
                      selectedImage === i
                        ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-white shadow-md"
                        : "ring-1 ring-gray-200 opacity-90 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-5 text-start sm:space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">{product.name}</h1>
              <div className="mt-2 flex items-center rtl:flex-row-reverse">
                <div className="flex items-center rtl:flex-row-reverse">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : i < product.rating
                          ? "text-yellow-400 fill-yellow-400 opacity-50"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="ms-2 text-sm text-gray-500 tabular-nums">
                  {product.rating} ({product.reviews_count} {t("reviews")})
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between rtl:sm:flex-row-reverse">
                <div className="min-w-0">
                  {product.is_on_sale &&
                    product.original_display_price != null &&
                    product.original_display_price > product.price && (
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="text-lg text-gray-400 line-through tabular-nums">
                          {formatPrice(product.original_display_price)}
                        </span>
                        {product.discount_percentage != null && product.discount_percentage > 0 && (
                          <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
                            −{product.discount_percentage}%
                          </span>
                        )}
                      </div>
                    )}
                  <p className="text-3xl font-bold tabular-nums text-gray-900 sm:text-4xl">{formatPrice(product.price)}</p>
                  {saleEndsLabel && (
                    <p className="mt-2 text-sm font-medium text-amber-700">
                      {t("Sale ends in")} {saleEndsLabel}
                    </p>
                  )}
                </div>
                <div
                  className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full px-3 py-1.5 text-sm font-medium ${
                    product.in_stock
                      ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80"
                      : "bg-red-50 text-red-800 ring-1 ring-red-200/80"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${product.in_stock ? "bg-emerald-500" : "bg-red-500"}`} />
                  {product.in_stock ? t("In Stock") : t("Out of Stock")}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 sm:p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t("Description")}</h3>
              {product.description ? (
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-gray-700">{product.description}</p>
              ) : (
                <p className="mt-3 text-sm text-gray-400">{t("No description available")}</p>
              )}
            </div>

            <div className="rounded-2xl border border-orange-100/90 bg-gradient-to-br from-orange-50/50 via-white to-white p-4 shadow-sm ring-1 ring-orange-100/50 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{t("Quantity")}</h3>
                  <div
                    className="mt-2 flex h-11 w-full max-w-[12rem] items-stretch overflow-hidden rounded-xl border border-orange-200/90 bg-white shadow-sm ring-1 ring-orange-100/60"
                    dir="ltr"
                  >
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="flex w-11 shrink-0 items-center justify-center text-lg font-semibold text-orange-950/80 transition hover:bg-orange-50 active:bg-orange-100/80 disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label={t("Decrease quantity")}
                    >
                      −
                    </button>
                    <span className="flex min-w-[3.25rem] flex-1 items-center justify-center border-x border-orange-200/80 bg-orange-50/40 text-lg font-bold tabular-nums text-orange-950">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={!product.in_stock || quantity >= product.stock}
                      className="flex w-11 shrink-0 items-center justify-center text-lg font-semibold text-orange-950/80 transition hover:bg-orange-50 active:bg-orange-100/80 disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label={t("Increase quantity")}
                    >
                      +
                    </button>
                  </div>
                  {product.in_stock ? (
                    <p className="mt-2 text-xs text-gray-500 tabular-nums">
                      {t("Stock")}: {product.stock} {t("units")}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 border-t border-orange-100/80 pt-4">
                <div
                  className={cn(
                    "flex h-12 w-full overflow-hidden rounded-2xl shadow-[0_6px_24px_-6px_rgba(249,115,22,0.45)] ring-1 ring-orange-300/50",
                    "focus-within:ring-2 focus-within:ring-orange-400/80",
                  )}
                >
                  <AddToCartButton
                    layout="compact"
                    quantity={quantity}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image_url || product.image || "",
                      description: product.description || "",
                      category: product.category || "",
                      stock: product.stock,
                      in_stock: product.in_stock,
                    }}
                    disabled={!product.in_stock}
                    className="h-12 min-h-12 min-w-0 flex-1 rounded-none rounded-l-2xl border-0 px-3 text-[15px] font-semibold shadow-none ring-0 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-white/90"
                  />
                  {product.vendor_whatsapp_url ? (
                    <a
                      href={product.vendor_whatsapp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={t("Contact seller on WhatsApp")}
                      className={cn(
                        "relative flex h-12 w-12 shrink-0 items-center justify-center border-l border-white/30",
                        "bg-gradient-to-br from-[#2FE06D] via-[#25D366] to-[#0F9D58]",
                        "text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
                        "transition hover:brightness-[1.06] active:brightness-[0.97]",
                        "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-0",
                      )}
                    >
                      <span
                        className="absolute inset-x-2 top-1 h-px rounded-full bg-white/40"
                        aria-hidden
                      />
                      <WhatsAppIcon className="relative h-[1.35rem] w-[1.35rem] drop-shadow-sm" />
                    </a>
                  ) : null}
                  <FavoriteButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image_url || product.image || "",
                      description: product.description || "",
                      category: product.category || "",
                      slug: product.slug,
                    }}
                    variant="outline"
                    size="icon"
                    appearance="vibrant"
                    className="h-12 w-12 min-w-12 shrink-0 rounded-none border-0 border-l border-white/30 p-0 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-white/90"
                  />
                  <button
                    type="button"
                    title={t("Share")}
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-none rounded-r-2xl border-0 border-l border-white/30",
                      "bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600",
                      "text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
                      "transition hover:brightness-110 active:brightness-95",
                      "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90",
                    )}
                    onClick={() => {
                      if (navigator.share) {
                        void navigator.share({
                          title: product.name,
                          url: window.location.href,
                        });
                      } else {
                        void navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                  >
                    <Share2 className="h-5 w-5 shrink-0 drop-shadow-sm" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3 sm:px-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t("Details")}</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex flex-wrap gap-x-2">
                  <span className="font-medium text-gray-900">{t("SKU")}</span>
                  <span className="tabular-nums text-gray-600">{product.id}</span>
                </li>
                <li className="flex flex-wrap gap-x-2">
                  <span className="font-medium text-gray-900">{t("Category")}</span>
                  <span>{category?.name ?? "—"}</span>
                </li>
                <li className="flex flex-wrap gap-x-2">
                  <span className="font-medium text-gray-900">{t("Stock")}</span>
                  <span className="tabular-nums">
                    {product.stock} {t("units")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <section id="reviews" className="mt-14 scroll-mt-24 border-t border-gray-200 pt-10 text-start">
          <h2 className="text-2xl font-bold text-gray-900">{t("Customer reviews")}</h2>
          <p className="mt-1 text-sm text-gray-500 tabular-nums">
            {product.rating > 0 ? `${product.rating} · ${product.reviews_count}` : "0"} {t("reviews")}
          </p>

          {flash?.review_submitted && (
            <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {t("Thank you review")}
            </p>
          )}

          {userReview && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {t("You reviewed this")}: {userReview.rating}/5
              {userReview.body ? ` — ${userReview.body}` : ""}
            </p>
          )}

          {canReview && auth?.user && (
            <form onSubmit={submitReview} className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900">{t("Write a review")}</h3>
              <div>
                <Label className="text-gray-700">{t("Your rating")}</Label>
                <div className="mt-2 flex gap-1 rtl:flex-row-reverse">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setData("rating", n)}
                      className="rounded p-0.5 transition hover:opacity-90"
                      aria-label={`${n} stars`}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          n <= data.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {errors?.rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                )}
              </div>
              <div>
                <Label htmlFor="review-body" className="text-gray-700">
                  {t("Your review")}
                </Label>
                <Textarea
                  id="review-body"
                  value={data.body}
                  onChange={(e) => setData("body", e.target.value)}
                  rows={4}
                  className="mt-2 bg-white"
                  placeholder={t("Review placeholder")}
                />
              </div>
              <Button type="submit" disabled={processing} className="bg-orange-600 hover:bg-orange-700">
                {processing ? "…" : t("Submit review")}
              </Button>
            </form>
          )}

          {!canReview && !userReview && !auth?.user && (
            <p className="mt-4 text-sm text-gray-600">
              <Link href="/login" className="font-medium text-orange-600 hover:underline">
                {t("Sign in to review")}
              </Link>
            </p>
          )}

          <ul className="mt-8 space-y-6">
            {reviewsList.length === 0 ? (
              <li className="text-sm text-gray-500">{t("No reviews yet")}</li>
            ) : (
              reviewsList.map((r) => (
                <li key={r.id} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 rtl:flex-row-reverse">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={r.user.avatar_url ?? undefined} alt="" />
                    <AvatarFallback className="text-xs">
                      {r.user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 rtl:flex-row-reverse">
                      <span className="font-medium text-gray-900">{r.user.name}</span>
                      {r.created_at && (
                        <span className="text-xs text-gray-500">
                          {new Date(r.created_at).toLocaleDateString(locale === "ar" ? "ar" : "en", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex rtl:flex-row-reverse">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-4 w-4 ${
                            n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    {r.body ? (
                      <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{r.body}</p>
                    ) : null}
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        {saleProducts.length > 0 ? (
          <div className="mt-16 border-t border-gray-100 pt-4">
            <ShopSales embedded products={saleProducts} />
          </div>
        ) : null}
      </div>
    </ShopFrontLayout>
  );
}

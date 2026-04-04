import ShopBanner, { type CarouselSlide } from '@/components/Shop/ShopBanner';
import ShopFrontLayout from '@/layouts/shop-layout';
import React, { Suspense } from 'react';
import { Category } from '../types/categories';
import { Product, SalesProduct } from '../types/products';

const ShopCategories = React.lazy(() => import('@/components/Shop/ShopCategories'));
const ShopProducts = React.lazy(() => import('@/components/Shop/ShopProducts'));
const ShopSales = React.lazy(() => import('@/components/Shop/ShopSales'));
const ShopDeliveryTrust = React.lazy(() => import('@/components/Shop/ShopDeliveryTrust'));

const CategoriesSkeleton = () => (
  <div className="w-full border-y border-zinc-200/80 py-5 md:py-7">
    <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
      <div className="mb-5 h-16 w-64 animate-pulse rounded-xl bg-zinc-100" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-square w-full animate-pulse rounded-2xl bg-zinc-100" />
            <div className="mx-auto h-3 w-3/4 animate-pulse rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProductsSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-5">
    <div className="mb-4 h-10 w-48 animate-pulse rounded-xl bg-zinc-100" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-zinc-100 animate-pulse h-72" />
      ))}
    </div>
  </div>
);

const GenericSkeleton = () => (
  <div className="w-full py-8 px-4">
    <div className="mx-auto max-w-7xl h-48 animate-pulse rounded-2xl bg-zinc-100" />
  </div>
);

export default function Home({
  categories,
  products,
  salesProducts,
  heroSlides,
}: {
  categories: Category[];
  products: Product[];
  salesProducts?: SalesProduct[];
  heroSlides?: CarouselSlide[];
}) {
  return (
    <div className="bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="px-3 sm:px-4 md:px-8 lg:px-12 xl:px-20">
        <ShopBanner slides={heroSlides} />
      </div>

      <Suspense fallback={<CategoriesSkeleton />}>
        <ShopCategories categories={categories} />
      </Suspense>

      <div className="py-4 md:py-6">
        <Suspense fallback={<ProductsSkeleton />}>
          <ShopProducts products={products} />
        </Suspense>
      </div>

      {salesProducts && salesProducts.length > 0 && (
        <div id="sales-section" className="bg-white">
          <Suspense fallback={<GenericSkeleton />}>
            <ShopSales products={salesProducts} />
          </Suspense>
        </div>
      )}

      <Suspense fallback={<GenericSkeleton />}>
        <ShopDeliveryTrust />
      </Suspense>
    </div>
  );
}

Home.layout = (page: React.ReactNode) => <ShopFrontLayout>{page}</ShopFrontLayout>;

// resources/js/Pages/Home.tsx
import ShopBanner from '@/components/frontend/ShopBanner';
import ShopCategories from '@/components/frontend/ShopCategories';
import ShopProducts from '@/components/frontend/ShopProducts';
import ShopFrontLayout from '@/layouts/shop-layout';
import React from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  color: string;
}

interface HomeProps {
  categories: Category[];
}

export default function Home({ categories }: HomeProps) {
  console.log('Categories received:', categories); // ← Debug log

  return (
    <div className="bg-white">
      <div className='px-20'>
        <ShopBanner />
      </div>
      <ShopCategories categories={categories} />
      <div className="py-18">
        <ShopProducts />
      </div>
    </div>
  );
}

Home.layout = (page: React.ReactNode) => <ShopFrontLayout>{page}</ShopFrontLayout>;

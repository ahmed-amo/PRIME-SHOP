import ShopBanner from '@/components/frontend/ShopBanner';
import ShopCategories from '@/components/frontend/ShopCategories';
import ShopProducts from '@/components/frontend/ShopProducts';
import ShopFrontLayout from '@/layouts/shop-layout';
import React from 'react';
import { Category } from '../types/categories';


export default function Home({ categories }: {categories:Category[]}) {
  console.log('Categories received:', categories);

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

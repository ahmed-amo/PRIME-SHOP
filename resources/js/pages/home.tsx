import ShopBanner from '@/components/frontend/ShopBanner';
import ShopCategories from '@/components/frontend/ShopCategories';
import ShopProducts from '@/components/frontend/ShopProducts';
import ShopFrontLayout from '@/layouts/shop-layout';
import React from 'react';
import { Category } from '../types/categories';
import { Product } from '../types/products';
import ShopSales from '@/components/frontend/ShopSales';

export default function Home({ categories, products }: { categories: Category[]; products: Product[] }) {
  return (
    <div className="bg-white">
      <div className='px-20'>
        <ShopBanner />
      </div>
      <ShopCategories categories={categories} />
      <div className="py-18">
        <ShopProducts products={products} />
      </div>
      <div>
        <ShopSales />
      </div>
    </div>
  );
}

Home.layout = (page: React.ReactNode) => <ShopFrontLayout>{page}</ShopFrontLayout>;

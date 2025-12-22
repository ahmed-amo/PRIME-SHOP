import ShopBanner from '@/components/frontend/ShopBanner';
import ShopCategories from '@/components/frontend/ShopCategories';
import ShopProducts from '@/components/frontend/ShopProducts';
import ShopFrontLayout from '@/layouts/shop-layout';
import React from 'react';
import { Category } from '../types/categories';
import { Product,SalesProduct } from '../types/products';
import ShopSales from '@/components/frontend/ShopSales';

export default function Home({ categories, products, salesProducts }: { categories: Category[]; products: Product[]; salesProducts?: SalesProduct[] }) {
  return (
    <div className="bg-white">
      <div className='px-20'>
        <ShopBanner />
      </div>
      <ShopCategories categories={categories} />
      <div className="py-18">
        <ShopProducts products={products} />
      </div>
      {salesProducts && salesProducts.length > 0 && (
        <div id="sales-section">
          <ShopSales products={salesProducts} />
        </div>
      )}
    </div>
  );
}

Home.layout = (page: React.ReactNode) => <ShopFrontLayout>{page}</ShopFrontLayout>;

import ShopBanner from '@/components/frontend/ShopBanner';
import ShopCategories from '@/components/frontend/ShopCategories';
import ShopProducts from '@/components/frontend/ShopProducts';
import ShopFrontLayout from '@/layouts/shop-layout';
import React from 'react';
import { Category } from '../types/categories';
import { Product } from '../types/products';
import ShopSales from '@/components/frontend/ShopSales';

interface SalesProduct {
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
}

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
        <div>
          <ShopSales products={salesProducts} />
        </div>
      )}
    </div>
  );
}

Home.layout = (page: React.ReactNode) => <ShopFrontLayout>{page}</ShopFrontLayout>;

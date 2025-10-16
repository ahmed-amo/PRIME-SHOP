
import ShopBanner from '@/components/frontend/ShopBanner'
import ShopCategories from '@/components/frontend/ShopCategories'
import ShopProducts from '@/components/frontend/ShopProducts'
import ShopFrontLayout from '@/layouts/shop-layout'
import React from 'react'


export default function home() {
  return (
    <div className="bg-white">
        <div className='px-20'>
        <ShopBanner />
        </div>
        <ShopCategories />
        <div className="py-18">
          <ShopProducts />
        </div>
    </div>
  )
}
home.layout = (page: React.ReactNode) => <ShopFrontLayout>{page}</ShopFrontLayout>;

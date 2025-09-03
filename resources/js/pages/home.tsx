import ShopHeader from '@/components/frontend/ShopHeader'
import ShopFooter from '@/components/frontend/ShopFooter'
import ShopBanner from '@/components/frontend/ShopBanner'
import ShopCategories from '@/components/frontend/ShopCategories'
import ShopProducts from '@/components/frontend/ShopProducts'
import React from 'react'
import { CategoryItem } from '@/types/categories'

export default function home({categories}:{categories:CategoryItem[]}) {
  return (
    <div className="bg-white">
        <ShopHeader />
        <div className='px-20'>
        <ShopBanner />
        </div>
        <ShopCategories categories={categories} />
        <div className="py-18">
          <ShopProducts />
        </div>
        <ShopFooter />
    </div>
  )
}

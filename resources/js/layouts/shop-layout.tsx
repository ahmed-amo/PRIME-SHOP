import React, { ReactNode } from 'react'
import ShopHeader from '../components/frontend/ShopHeader'
import ShopFooter from '../components/frontend/ShopFooter'
import { CartProvider } from '../contexts/cartContext';
import { usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import { WishlistProvider } from '../contexts/wishlistContext';

export default function ShopFrontLayout({children}: {children: ReactNode}) {

    const { auth } = usePage<PageProps>().props
    const userId = auth?.user?.id || null
  return (
    <CartProvider userId={userId}>
      <WishlistProvider>
        <div className='bg-white'>
        <ShopHeader />
            {children}
        <ShopFooter />
    </div>
      </WishlistProvider>
    </CartProvider>

  )
}

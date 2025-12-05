import React, { ReactNode } from 'react'
import ShopHeader from '../components/frontend/ShopHeader'
import ShopFooter from '../components/frontend/ShopFooter'
import { CartProvider } from '../contexts/cartContext';
import { WishlistProvider } from '../contexts/wishlistContext';
export default function ShopFrontLayout({children}: {children: ReactNode}) {
  return (
    <CartProvider>
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

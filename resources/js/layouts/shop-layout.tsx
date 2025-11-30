import React, { ReactNode } from 'react'
import ShopHeader from '../components/frontend/ShopHeader'
import ShopFooter from '../components/frontend/ShopFooter'
import { CartProvider } from '../contexts/cartContext';
export default function ShopFrontLayout({children}: {children: ReactNode}) {
  return (
    <CartProvider>
        <div className='bg-white'>
        <ShopHeader />
            {children}
        <ShopFooter />
    </div>
    </CartProvider>

  )
}

import React, { ReactNode } from 'react'
import ShopHeader from '../components/frontend/ShopHeader'
import ShopFooter from '../components/frontend/ShopFooter'

export default function ShopFrontLayout({children}: {children: ReactNode}) {
  return (
    <div className='bg-white'>
        <ShopHeader />
            {children}
        <ShopFooter />
    </div>
  )
}

import React, { ReactNode } from 'react'
import ShopHeader from '../components/frontend/ShopHeader'
import ShopFooter from '../components/frontend/ShopFooter'
import AppProviders from './Provider'

export default function ShopFrontLayout({children}: {children: ReactNode}) {
  return (

    <AppProviders>
      <div className='bg-white'>
        <ShopHeader />
          {children}
        <ShopFooter />
      </div>
    </AppProviders>

  )
}

import React, { ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import { CartProvider } from '../contexts/cartContext'
import { WishlistProvider } from '../contexts/wishlistContext'
import PhoneRequiredGate from '@/components/PhoneRequiredGate'

export default function AppProviders({ children }: { children: ReactNode }) {
  const { auth } = usePage<PageProps>().props
  const userId = auth?.user?.id || null

  return (
    <CartProvider userId={userId}>
      <WishlistProvider userId={userId}>
        <PhoneRequiredGate />
        {children}
      </WishlistProvider>
    </CartProvider>
  )
}

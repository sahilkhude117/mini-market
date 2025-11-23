import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/components/app-providers'
import { AppLayout } from '@/components/app-layout'
import { GlobalProvider } from '@/lib/contexts/GlobalContext'
import React from 'react'

export const metadata: Metadata = {
  title: 'Prediction Market - Minimarket',
  description: 'Decentralized prediction market on Solana',
}

const links: { label: string; path: string }[] = [
  { label: 'Markets', path: '/markets' },
  { label: 'Propose', path: '/propose' },
  { label: 'Fund', path: '/fund' },
  { label: 'Profile', path: '/profile' },
  { label: 'Referral', path: '/referral' },
  { label: 'About', path: '/about' },
  { label: 'Account', path: '/account' },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <AppProviders>
          <GlobalProvider>
            <AppLayout links={links}>{children}</AppLayout>
          </GlobalProvider>
        </AppProviders>
      </body>
    </html>
  )
}

// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}

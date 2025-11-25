import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/components/app-providers'
import { GlobalProvider } from '@/lib/contexts/GlobalContext'
import React from 'react'

export const metadata: Metadata = {
  title: 'Pythia Markets - Decentralized Prediction Markets',
  description: 'Decentralized prediction market on Solana',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-white">
        <AppProviders>
          <GlobalProvider>
            <div className="min-h-screen">
              {children}
            </div>
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

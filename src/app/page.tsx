import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="w-full py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Decentralized Prediction Markets
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Create, fund, and trade on prediction markets powered by Solana
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/markets">
              <Button size="lg" className="text-lg">
                Explore Markets
              </Button>
            </Link>
            <Link href="/propose">
              <Button size="lg" variant="outline" className="text-lg">
                Create Market
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-1 flex-col px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="text-xl font-bold mb-2">🎯 Create Markets</h3>
            <p className="text-muted-foreground">
              Propose prediction markets on any future event and earn fees
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="text-xl font-bold mb-2">💰 Provide Liquidity</h3>
            <p className="text-muted-foreground">
              Fund markets and earn a share of all trading fees
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="text-xl font-bold mb-2">📈 Trade & Win</h3>
            <p className="text-muted-foreground">
              Bet on outcomes and win from the prediction pool
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

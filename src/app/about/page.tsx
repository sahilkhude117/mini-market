import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">About Prediction Market</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">What is this?</h2>
          <p className="text-gray-700 mb-4">
            A decentralized prediction market built on Solana blockchain. Users can create markets about future events,
            provide liquidity, and place bets on outcomes using SPL tokens.
          </p>
          <p className="text-gray-700">
            All transactions are secured by smart contracts and executed on-chain, ensuring transparency and fairness.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Create a Market</h3>
              <p className="text-gray-700">
                Propose a prediction market about any future event. Set the question, target value, and expiry date.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Fund Markets</h3>
              <p className="text-gray-700">
                Provide liquidity to pending markets to activate them. Liquidity providers earn 1% of all trading fees.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Place Bets</h3>
              <p className="text-gray-700">
                Once a market is active, users can bet YES or NO on the outcome. Token prices adjust based on demand.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Oracle Resolution</h3>
              <p className="text-gray-700">
                When the market expires, oracles determine the outcome. Winners receive their share of the pool.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Fee Structure</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Market Creation Fee:</span>
              <span className="font-semibold">0.001 SOL</span>
            </div>
            <div className="flex justify-between">
              <span>Trading Fee:</span>
              <span className="font-semibold">2.5%</span>
            </div>
            <div className="flex justify-between">
              <span>Liquidity Provider Fee:</span>
              <span className="font-semibold">1.0%</span>
            </div>
            <div className="flex justify-between">
              <span>Funding Fee:</span>
              <span className="font-semibold">1.5%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Referral Program</h2>
          <p className="text-gray-700 mb-4">
            Earn rewards by referring friends to the platform:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Level 0: Earn 0.35% of direct referrals&apos; trading fees</li>
            <li>Level 1: Earn 0.1% of second-level referrals&apos; fees</li>
            <li>Level 2: Earn 0.05% of third-level referrals&apos; fees</li>
          </ul>
          <Link
            href="/referral"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Get your referral code →
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Technology</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>Blockchain:</strong> Solana
            </p>
            <p className="text-gray-700">
              <strong>Smart Contracts:</strong> Anchor Framework
            </p>
            <p className="text-gray-700">
              <strong>Frontend:</strong> Next.js, React, TypeScript
            </p>
            <p className="text-gray-700">
              <strong>Backend:</strong> Next.js API Routes, MongoDB
            </p>
            <p className="text-gray-700">
              <strong>Oracles:</strong> Switchboard (On-Demand)
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Support & Resources</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              For questions or support, please reach out through our community channels.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-blue-600 hover:underline">
                Documentation
              </a>
              <a href="#" className="text-blue-600 hover:underline">
                GitHub
              </a>
              <a href="#" className="text-blue-600 hover:underline">
                Discord
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

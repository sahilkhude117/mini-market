"use client";

import { useEffect, useState } from "react";
import { useWalletUi } from "@wallet-ui/react";
import { profileAPI } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  const { account } = useWalletUi();
  const publicKey = account?.address;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (publicKey) {
      loadProfile();
    }
  }, [publicKey]);

  const loadProfile = async () => {
    if (!publicKey) return;

    try {
      setLoading(true);
      const data = await profileAPI.get(publicKey.toString());
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="mb-6">Please connect your wallet to view your profile</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Active Bets</h3>
          <p className="text-3xl font-bold">{profile?.activeBet || 0}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Bets</h3>
          <p className="text-3xl font-bold">{profile?.totalBet || 0}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Earned from Bets</h3>
          <p className="text-3xl font-bold">{profile?.earnedBet?.toFixed(4) || 0} SOL</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Liquidity Provided</h3>
          <p className="text-3xl font-bold">{profile?.totalLiquidityProvided?.toFixed(4) || 0} SOL</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Earned from Liquidity</h3>
          <p className="text-3xl font-bold">{profile?.earnedFeeLiquidity?.toFixed(4) || 0} SOL</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Markets Proposed</h3>
          <p className="text-3xl font-bold">{profile?.totalProposedMarket || 0}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Referrals</h3>
          <p className="text-3xl font-bold">{profile?.totalreferrals || 0}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Betting History */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Betting History</h2>
          {profile?.bettingHistory?.length > 0 ? (
            <div className="space-y-3">
              {profile.bettingHistory.slice(0, 5).map((market: any) => (
                <Link
                  key={market._id}
                  href={`/markets/${market._id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50"
                >
                  <p className="font-semibold">{market.question}</p>
                  <p className="text-sm text-gray-500">Status: {market.marketStatus}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No betting history yet</p>
          )}
        </Card>

        {/* Funded Markets */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Funded Markets</h2>
          {profile?.fundedMarkets?.length > 0 ? (
            <div className="space-y-3">
              {profile.fundedMarkets.slice(0, 5).map((market: any) => (
                <Link
                  key={market._id}
                  href={`/markets/${market._id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50"
                >
                  <p className="font-semibold">{market.question}</p>
                  <p className="text-sm text-gray-500">Status: {market.marketStatus}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No funded markets yet</p>
          )}
        </Card>

        {/* Proposed Markets */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">My Proposed Markets</h2>
          {profile?.proposedMarket?.length > 0 ? (
            <div className="space-y-3">
              {profile.proposedMarket.map((market: any) => (
                <Link
                  key={market._id}
                  href={`/markets/${market._id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50"
                >
                  <p className="font-semibold">{market.question}</p>
                  <p className="text-sm text-gray-500">Status: {market.marketStatus}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-gray-500 mb-4">No proposed markets yet</p>
              <Link href="/propose">
                <Button>Propose a Market</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

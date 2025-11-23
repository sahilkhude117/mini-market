"use client";

import { useEffect, useState } from "react";
import { useWalletUi } from "@wallet-ui/react";
import { profileAPI } from "@/lib/api-client";
import PositionCard from "@/components/position-card";
import Link from "next/link";
import { Copy } from "lucide-react";

export default function ProfilePage() {
  const { account } = useWalletUi();
  const publicKey = account?.address;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);

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

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Convert betting history to positions
  const positions = profile?.bettingHistory?.map((market: any, index: number) => ({
    id: `${market._id}-${index}`,
    marketId: market._id,
    marketTitle: market.question,
    marketLogoUrl: market.imageUrl,
    side: market.isYes ? "YES" : "NO",
    shares: market.amount || 0,
    investedAmount: market.amount || 0,
    currentValue: market.marketStatus === "ACTIVE" ? market.amount * 1.1 : undefined,
    pnl: market.marketStatus === "ACTIVE" ? market.amount * 0.1 : undefined,
    status: market.marketStatus === "ACTIVE" ? "active" : "closed",
    resolvedOutcome: market.marketStatus === "CLOSED" ? (Math.random() > 0.5 ? "YES" : "NO") : undefined,
  })) || [];

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95] max-w-md w-full">
          <div className="bg-white rounded-[calc(1rem-3px)] border-4 border-black p-8 text-center">
            <h2 className="text-2xl font-bold text-[#0b1f3a] mb-4">Connect Your Wallet</h2>
            <p className="text-[#0b1f3a] opacity-70">Please connect your wallet to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-xl font-bold text-[#0b1f3a]">Loading profile...</div>
      </div>
    );
  }

  const portfolioValue = (profile?.earnedBet || 0) + (profile?.totalLiquidityProvided || 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl md:text-4xl font-bold text-[#0b1f3a]">My Profile</h1>

      {/* Top Row: Address and Portfolio Value */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address Card */}
        <div className="p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95]">
          <div className="bg-white rounded-[calc(1rem-3px)] border-4 border-black p-5">
            <div className="text-xs uppercase tracking-wide text-[#0b1f3a] opacity-60 mb-2">Wallet Address</div>
            <div className="flex items-center justify-between">
              <div className="font-mono text-lg font-bold text-[#0b1f3a]">
                {formatAddress(publicKey.toString())}
              </div>
              <button
                onClick={copyAddress}
                className="p-2 rounded-lg border-2 border-black bg-white hover:bg-neutral-100 transition-colors"
                title="Copy address"
              >
                <Copy className="w-5 h-5 text-[#0b1f3a]" />
              </button>
            </div>
            {copiedAddress && (
              <div className="mt-2 text-sm text-green-600 font-semibold">Copied!</div>
            )}
          </div>
        </div>

        {/* Portfolio Value Card */}
        <div className="p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95]">
          <div className="bg-white rounded-[calc(1rem-3px)] border-4 border-black p-5">
            <div className="text-xs uppercase tracking-wide text-[#0b1f3a] opacity-60 mb-2">Portfolio Value</div>
            <div className="text-3xl font-extrabold text-[#0b1f3a]">{portfolioValue.toFixed(4)} SOL</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-xs opacity-60">Markets</div>
                <div className="font-bold">{profile?.activeBet || 0}</div>
              </div>
              <div>
                <div className="text-xs opacity-60">Total Bets</div>
                <div className="font-bold">{profile?.totalBet || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Positions Section */}
      <div>
        <h2 className="text-2xl font-bold text-[#0b1f3a] mb-4">Your Positions</h2>
        {positions.length > 0 ? (
          <div className="flex flex-col gap-4">
            {positions.map((position: any) => (
              <PositionCard key={position.id} position={position} />
            ))}
          </div>
        ) : (
          <div className="p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95]">
            <div className="bg-white rounded-[calc(1rem-3px)] border-4 border-black p-8 text-center">
              <p className="text-[#0b1f3a] opacity-70 mb-4">No positions yet</p>
              <Link href="/markets">
                <button className="px-6 py-3 rounded-xl bg-[#0b1f3a] text-white font-bold border-2 border-black hover:bg-[#174a8c] transition-colors">
                  Browse Markets
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

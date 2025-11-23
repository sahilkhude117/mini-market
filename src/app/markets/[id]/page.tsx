"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMarket } from "@/hooks/use-markets";
import Sparkline from "@/components/sparkline";
import { calculateMarketStats } from "@/lib/data-adapters";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MarketDetailPage() {
  const params = useParams();
  const marketId = params?.id as string;
  const { market, rawMarket, loading } = useMarket(marketId);
  const [betAmount, setBetAmount] = useState("");
  const [placingBet, setPlacingBet] = useState(false);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-xl font-bold text-[#0b1f3a]">Loading market...</div>
      </div>
    );
  }

  if (!market || !rawMarket) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-[#0b1f3a] mb-4">Market not found</h2>
        <Link href="/markets">
          <button className="px-6 py-3 rounded-xl bg-[#0b1f3a] text-white font-bold border-2 border-black hover:bg-[#174a8c]">
            Back to Markets
          </button>
        </Link>
      </div>
    );
  }

  const stats = calculateMarketStats(rawMarket);

  const handlePlaceBet = async (isYes: boolean) => {
    if (!betAmount || parseFloat(betAmount) <= 0) return;
    
    setPlacingBet(true);
    try {
      // TODO: Implement actual bet placement logic
      console.log(`Placing ${betAmount} SOL bet on ${isYes ? "YES" : "NO"}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction
      alert(`Bet placed successfully!`);
      setBetAmount("");
    } catch (error) {
      console.error("Failed to place bet:", error);
      alert("Failed to place bet");
    } finally {
      setPlacingBet(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back Button */}
      <Link href="/markets" className="inline-flex items-center gap-2 text-[#0b1f3a] hover:opacity-70 w-fit">
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">Back to Markets</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Market Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Market Header */}
          <div className="p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95]">
            <div className="bg-white rounded-[calc(1rem-3px)] border-4 border-black p-6">
              <div className="flex items-start gap-4 mb-4">
                {market.logoUrl && (
                  <img
                    src={market.logoUrl}
                    alt="Market logo"
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-[#0b1f3a] mb-2">
                    {market.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 border-2 border-black bg-white rounded-full px-3 py-1 text-sm font-bold text-[#0b1f3a]">
                      Status: {market.status}
                    </span>
                    <span className="inline-flex items-center gap-1 border-2 border-black bg-white rounded-full px-3 py-1 text-sm font-bold text-[#0b1f3a]">
                      {new Date(market.resolutionDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[#0b1f3a] mb-4">{market.description}</p>

              {/* Market Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t-2 border-black">
                <div>
                  <div className="text-xs uppercase tracking-wide text-[#0b1f3a] opacity-60">YES Probability</div>
                  <div className="text-2xl font-extrabold text-[#0b1f3a]">{stats.yesProbability.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-[#0b1f3a] opacity-60">NO Probability</div>
                  <div className="text-2xl font-extrabold text-[#0b1f3a]">{stats.noProbability.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-[#0b1f3a] opacity-60">Total Volume</div>
                  <div className="text-2xl font-extrabold text-[#0b1f3a]">{stats.totalVolume.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-[#0b1f3a] opacity-60">Liquidity</div>
                  <div className="text-2xl font-extrabold text-[#0b1f3a]">{stats.liquidity.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Chart */}
          {market.priceSeries && market.priceSeries.length > 0 && (
            <div className="p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95]">
              <div className="bg-white rounded-[calc(1rem-3px)] border-4 border-black p-6">
                <h2 className="text-xl font-extrabold text-[#0b1f3a] mb-4">Price History</h2>
                <Sparkline
                  values={market.priceSeries}
                  height={200}
                  className="w-full"
                  showAxes
                  showTooltip
                  showCurrentRefLine
                  yStartAtZero
                />
              </div>
            </div>
          )}

          {/* Market Details */}
          <div className="p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95]">
            <div className="bg-white rounded-[calc(1rem-3px)] border-4 border-black p-6">
              <h2 className="text-xl font-extrabold text-[#0b1f3a] mb-4">Market Information</h2>
              <div className="space-y-3 text-[#0b1f3a]">
                <div>
                  <div className="text-sm font-bold opacity-70">Creator</div>
                  <div className="font-mono text-sm">{rawMarket.creator}</div>
                </div>
                <div>
                  <div className="text-sm font-bold opacity-70">Feed Name</div>
                  <div>{rawMarket.feedName}</div>
                </div>
                <div>
                  <div className="text-sm font-bold opacity-70">Target Value</div>
                  <div>{rawMarket.value} (±{rawMarket.range})</div>
                </div>
                <div>
                  <div className="text-sm font-bold opacity-70">Resolution Date</div>
                  <div>{new Date(rawMarket.date).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Trading Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Trade Panel */}
          <div className="p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95] sticky top-24">
            <div className="bg-white rounded-[calc(1rem-3px)] border-4 border-black p-6">
              <h2 className="text-xl font-extrabold text-[#0b1f3a] mb-4">Place Your Bet</h2>
              
              {market.status === "active" ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount" className="text-sm font-bold text-[#0b1f3a]">
                      Amount (SOL)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder="0.00"
                      className="mt-2 border-2 border-black rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handlePlaceBet(true)}
                      disabled={placingBet || !betAmount || parseFloat(betAmount) <= 0}
                      className={`w-full px-4 py-4 rounded-xl font-bold border-2 border-black transition-colors ${
                        placingBet || !betAmount || parseFloat(betAmount) <= 0
                          ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      Buy YES ({stats.yesProbability.toFixed(1)}%)
                    </button>
                    <button
                      onClick={() => handlePlaceBet(false)}
                      disabled={placingBet || !betAmount || parseFloat(betAmount) <= 0}
                      className={`w-full px-4 py-4 rounded-xl font-bold border-2 border-black transition-colors ${
                        placingBet || !betAmount || parseFloat(betAmount) <= 0
                          ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      Buy NO ({stats.noProbability.toFixed(1)}%)
                    </button>
                  </div>

                  {placingBet && (
                    <div className="text-center text-sm text-[#0b1f3a] opacity-70">
                      Processing transaction...
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-[#0b1f3a] opacity-70">
                  This market is {market.status}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

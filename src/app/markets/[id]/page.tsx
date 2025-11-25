"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import RootLayoutClient from "@/components/root-layout-client";
import Sparkline from "@/components/sparkline-new";
import { marketAPI } from "@/lib/api-client";

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function MarketDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [market, setMarket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<string>("");
  const [isSubmittingYes, setIsSubmittingYes] = useState(false);
  const [isSubmittingNo, setIsSubmittingNo] = useState(false);

  useEffect(() => {
    if (id) {
      loadMarket();
    }
  }, [id]);

  const loadMarket = async () => {
    try {
      setLoading(true);
      const data = await marketAPI.getById(id);
      setMarket(data);
    } catch (error) {
      console.error("Failed to load market:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !market) {
    return (
      <RootLayoutClient>
        <div className="max-w-3xl">
          <div className="text-[#0b1f3a] font-bold">Loading market…</div>
        </div>
      </RootLayoutClient>
    );
  }

  const estimatedEndMs = market.resultsEndMs || market.opportunityEndMs || (market.endTime ? new Date(market.endTime).getTime() : Date.now() + 86400000);
  const estimatedDate = new Date(estimatedEndMs).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const priceSeries = market.priceSeries || [50, 52, 48, 55, 54, 60, 58, 62];
  const currentProbability = priceSeries.length > 0 ? priceSeries[priceSeries.length - 1] : 50;
  const currentPriceUsd = currentProbability / 100;

  const chartTimestamps = useMemo(() => {
    const len = priceSeries.length;
    if (len === 0) return [] as number[];
    const end = Date.now();
    const start = end - (len - 1) * 3600_000;
    return Array.from({ length: len }, (_, i) => start + i * 3600_000);
  }, [priceSeries]);

  function handleBuy(side: "YES" | "NO") {
    const solAmount = parseFloat(amount);
    if (!isFinite(solAmount) || solAmount <= 0) return;
    if (side === "YES") setIsSubmittingYes(true);
    if (side === "NO") setIsSubmittingNo(true);

    // Mock buy - integrate with actual smart contract
    setTimeout(() => {
      console.log(`Buying ${side} with ${solAmount} SOL`);
      if (side === "YES") setIsSubmittingYes(false);
      if (side === "NO") setIsSubmittingNo(false);
      setAmount("");
    }, 2000);
  }

  return (
    <RootLayoutClient>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-8 items-start">
          <div className="space-y-8">
            <header className="flex gap-4 items-start">
              {market.logoUrl || market.image ? (
                <img
                  src={market.logoUrl || market.image}
                  alt="Market logo"
                  className="w-12 h-12 md:w-16 md:h-16 object-contain"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0b1f3a]">
                  {market.title || market.question || "Untitled Market"}
                </h2>
                <div className="mt-2 flex items-center gap-2 text-xs md:text-sm text-[#0b1f3a] opacity-70">
                  <CalendarIcon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-bold">{estimatedDate}</span>
                </div>
                <div className="mt-3">
                  <div className="text-xs uppercase tracking-wide text-[#0b1f3a] opacity-60">
                    Predicted
                  </div>
                  <div className="text-3xl md:text-5xl font-extrabold text-[#0b1f3a] tabular-nums">
                    {currentProbability.toFixed(1)}%
                  </div>
                </div>
              </div>
            </header>

            <section>
              <Sparkline
                values={priceSeries}
                height={320}
                stroke="#000"
                className="block w-full"
                showAxes
                showTooltip
                showCurrentRefLine
                yStartAtZero
                timestamps={chartTimestamps}
              />
              <div className="mt-4 border-4 border-black rounded-2xl p-4 bg-white">
                <div className="text-sm font-extrabold text-[#0b1f3a] uppercase tracking-wide">
                  Resolution criteria
                </div>
                <p className="mt-2 text-sm md:text-base text-[#0b1f3a] opacity-80">
                  {market.resolutionCriteria || market.description || "To be determined"}
                </p>
              </div>
            </section>

            {market.description && (
              <section>
                <h4 className="text-lg md:text-xl font-extrabold text-[#0b1f3a]">
                  Details
                </h4>
                <p className="mt-2 text-sm md:text-base text-[#0b1f3a]">
                  {market.description}
                </p>
              </section>
            )}
          </div>

          {/* Trade Panel */}
          <aside className="sticky top-24">
            <div className="border-4 border-black rounded-2xl bg-white p-4 md:p-6 shadow-lg">
              <h3 className="text-xl md:text-2xl font-extrabold text-[#0b1f3a] mb-4">
                Place your bet
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-[#0b1f3a] mb-2">
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border-2 border-black rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#174a8c]"
                  step="0.1"
                  min="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleBuy("YES")}
                  disabled={isSubmittingYes || !amount}
                  className="px-4 py-3 rounded-xl bg-green-600 text-white font-extrabold border-2 border-black hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingYes ? "Buying..." : `YES ${currentProbability.toFixed(0)}%`}
                </button>
                <button
                  type="button"
                  onClick={() => handleBuy("NO")}
                  disabled={isSubmittingNo || !amount}
                  className="px-4 py-3 rounded-xl bg-red-600 text-white font-extrabold border-2 border-black hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingNo ? "Buying..." : `NO ${(100 - currentProbability).toFixed(0)}%`}
                </button>
              </div>

              <div className="text-xs text-[#0b1f3a] opacity-70 space-y-1">
                <div className="flex justify-between">
                  <span>Current price:</span>
                  <span className="font-bold">${currentPriceUsd.toFixed(2)}</span>
                </div>
                {amount && parseFloat(amount) > 0 && (
                  <div className="flex justify-between">
                    <span>Potential shares:</span>
                    <span className="font-bold">
                      {(parseFloat(amount) * 185 / currentPriceUsd).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </RootLayoutClient>
  );
}

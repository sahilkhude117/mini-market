"use client";

import { useEffect, useState } from "react";
import RootLayoutClient from "@/components/root-layout-client";
import { useUserAddress } from "@/hooks/use-user-address";
import MarketPreviewCard from "@/components/market-preview-card-new";
import { useMarkets } from "@/hooks/use-markets";
import { marketAPI } from "@/lib/api-client";
import { useGlobalContext } from "@/lib/contexts/GlobalContext";

export default function ProfilePage() {
  const { short, address } = useUserAddress();
  const { formatMarketData, markets } = useGlobalContext();
  const { markets: activeMarkets } = useMarkets("active");
  const { markets: closedMarkets } = useMarkets("closed");
  const [loading, setLoading] = useState(true);

  const balanceUsd = 1000; // Mock balance
  const pnlUsd = 150; // Mock PnL

  useEffect(() => {
    // Only load markets if not already loaded
    if (markets.length > 0) {
      setLoading(false);
      return;
    }

    const loadMarkets = async () => {
      try {
        const data = await marketAPI.get({
          marketStatus: "ACTIVE",
          page: 1,
          limit: 50,
        });
        formatMarketData(data.data || []);
      } catch (error) {
        console.error("Failed to load markets:", error);
        formatMarketData([]);
      } finally {
        setLoading(false);
      }
    };
    loadMarkets();
  }, [formatMarketData, markets.length]);

  const now = Date.now();
  
  // Filter for current markets (public only, active)
  const currentMarkets = activeMarkets.filter((m: any) => {
    const oppEndMs = m.opportunityEndMs || (m.endTime ? new Date(m.endTime).getTime() : Date.now() + 86400000);
    const resultsEndMs = m.resultsEndMs || oppEndMs;
    return now >= oppEndMs && (resultsEndMs == null || now < resultsEndMs);
  });

  // Ended markets
  const endedMarkets = closedMarkets;

  return (
    <RootLayoutClient>
      <div className="max-w-4xl w-full mx-auto">
        {/* Top metrics: left box (address + portfolio value), right box (cumulative PnL) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border-4 border-black rounded-2xl bg-white p-4 flex flex-col gap-2">
            <div className="text-xs uppercase tracking-wide text-[#0b1f3a] opacity-60">Address</div>
            <div className="text-base md:text-lg font-extrabold text-[#0b1f3a] font-mono">{short}</div>
            <div className="text-xs uppercase tracking-wide text-[#0b1f3a] opacity-60 mt-2">Portfolio Value</div>
            <div className="text-3xl md:text-4xl font-extrabold text-[#0b1f3a]">{fmtUsd(balanceUsd)}</div>
          </div>
          <div className="border-4 border-black rounded-2xl bg-white p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-[#0b1f3a] opacity-60">Cumulative PnL</div>
              <div className={`text-3xl md:text-4xl font-extrabold ${pnlUsd >= 0 ? "text-green-700" : "text-red-700"}`}>
                {fmtSignedUsd(pnlUsd)}
              </div>
            </div>
          </div>
        </div>

        {/* Current Markets */}
        <section className="mb-8">
          <div className="mb-3 md:mb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0b1f3a]">Your Current Markets</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {currentMarkets.map((m: any) => {
              const opportunityStartMs = (m.opportunityEndMs || Date.now()) - 24 * 3600_000;
              return (
                <MarketPreviewCard
                  key={m.id}
                  id={m.id}
                  logoUrl={m.logoUrl || m.image || ""}
                  title={m.title || m.question || "Untitled Market"}
                  description={m.description || ""}
                  opportunityStartMs={opportunityStartMs}
                  opportunityEndMs={m.opportunityEndMs || (m.endTime ? new Date(m.endTime).getTime() : Date.now() + 86400000)}
                  resultsEndMs={m.resultsEndMs}
                  nextOpportunityStartMs={m.nextOpportunityStartMs}
                  isPriceHidden={false}
                  attentionScore={m.attentionScore}
                  priceSeries={m.priceSeries || [50, 52, 48, 55, 54, 60, 58]}
                  className="w-full"
                />
              );
            })}
          </div>
          {currentMarkets.length === 0 && !loading && (
            <p className="text-[#0b1f3a] opacity-70">No current markets</p>
          )}
        </section>

        {/* Ended Markets */}
        <section>
          <div className="mb-3 md:mb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0b1f3a]">Ended Markets</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {endedMarkets.map((m: any) => {
              const opportunityStartMs = (m.opportunityEndMs || Date.now()) - 24 * 3600_000;
              return (
                <MarketPreviewCard
                  key={m.id}
                  id={m.id}
                  logoUrl={m.logoUrl || m.image || ""}
                  title={m.title || m.question || "Untitled Market"}
                  description={m.description || ""}
                  opportunityStartMs={opportunityStartMs}
                  opportunityEndMs={m.opportunityEndMs || (m.endTime ? new Date(m.endTime).getTime() : Date.now() + 86400000)}
                  resultsEndMs={m.resultsEndMs}
                  nextOpportunityStartMs={m.nextOpportunityStartMs}
                  isPriceHidden={false}
                  attentionScore={m.attentionScore}
                  priceSeries={m.priceSeries || [50, 52, 48, 55, 54, 60, 58]}
                  className="w-full"
                />
              );
            })}
          </div>
          {endedMarkets.length === 0 && !loading && (
            <p className="text-[#0b1f3a] opacity-70">No ended markets</p>
          )}
        </section>
      </div>
    </RootLayoutClient>
  );
}

function fmtUsd(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function fmtSignedUsd(n: number): string {
  const sign = n >= 0 ? "" : "-";
  const v = Math.abs(n);
  return `${sign}$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

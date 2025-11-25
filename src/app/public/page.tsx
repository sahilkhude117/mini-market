"use client";

import { useEffect, useState } from "react";
import RootLayoutClient from "@/components/root-layout-client";
import MarketPreviewCard from "@/components/market-preview-card-new";
import { useMarkets } from "@/hooks/use-markets";
import { marketAPI } from "@/lib/api-client";
import { useGlobalContext } from "@/lib/contexts/GlobalContext";

export default function PublicMarketsPage() {
  const { formatMarketData, markets } = useGlobalContext();
  const { markets: activeMarkets } = useMarkets("active");
  const [loading, setLoading] = useState(true);

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
  const publicItems = activeMarkets.filter((m: any) => {
    const oppEndMs = m.opportunityEndMs || (m.endTime ? new Date(m.endTime).getTime() : Date.now() + 86400000);
    const resultsEndMs = m.resultsEndMs || oppEndMs;
    return now >= oppEndMs && (resultsEndMs == null || now < resultsEndMs);
  });

  return (
    <RootLayoutClient>
      <div className="flex flex-col gap-8 md:gap-10">
        <section aria-label="Public markets">
          <div className="mb-3 md:mb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0b1f3a]">Public markets</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {publicItems.map((m: any) => {
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
          {publicItems.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-lg text-[#0b1f3a] opacity-70">
                No public markets available at this time.
              </p>
            </div>
          )}
        </section>
      </div>
    </RootLayoutClient>
  );
}

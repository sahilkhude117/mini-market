"use client";

import { useEffect, useState } from "react";
import RootLayoutClient from "@/components/root-layout-client";
import HorizontalTicker from "@/components/horizontal-ticker-new";
import MarketPreviewCard from "@/components/market-preview-card-new";
import AboutSection from "@/components/about-section";
import { useMarkets } from "@/hooks/use-markets";
import { marketAPI } from "@/lib/api-client";
import { useGlobalContext } from "@/lib/contexts/GlobalContext";

export default function Home() {
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
          limit: 20,
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
    // Only show public markets that are in trading phase
    const oppEndMs = m.opportunityEndMs || (m.endTime ? new Date(m.endTime).getTime() : Date.now() + 86400000);
    const resultsEndMs = m.resultsEndMs || oppEndMs;
    return now >= oppEndMs && (resultsEndMs == null || now < resultsEndMs);
  });

  return (
    <RootLayoutClient>
      <div className="flex flex-col gap-8 md:gap-10">
        {publicItems.length > 0 && (
          <HorizontalTicker
            title="Public markets"
            items={publicItems}
            speedMs={13_000}
            renderItem={(market: any) => {
              const opportunityStartMs = (market.opportunityEndMs || Date.now()) - 24 * 3600_000;
              return (
                <MarketPreviewCard
                  key={market.id}
                  id={market.id}
                  logoUrl={market.logoUrl || market.image || ""}
                  title={market.title || market.question || "Untitled Market"}
                  description={market.description || ""}
                  opportunityStartMs={opportunityStartMs}
                  opportunityEndMs={market.opportunityEndMs || (market.endTime ? new Date(market.endTime).getTime() : Date.now() + 86400000)}
                  resultsEndMs={market.resultsEndMs}
                  nextOpportunityStartMs={market.nextOpportunityStartMs}
                  isPriceHidden={false}
                  attentionScore={market.attentionScore}
                  priceSeries={market.priceSeries || [50, 52, 48, 55, 54, 60, 58]}
                  className="w-[320px] md:w-[360px] h-[320px] overflow-hidden shrink-0"
                />
              );
            }}
          />
        )}

        {publicItems.length === 0 && !loading && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-[#0b1f3a] mb-4">
              No markets available yet
            </h2>
            <p className="text-lg text-[#0b1f3a] opacity-70">
              Be the first to create a market!
            </p>
          </div>
        )}

        <AboutSection />
      </div>
    </RootLayoutClient>
  );
}

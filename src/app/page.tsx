"use client";

import { useEffect, useState } from "react";
import HorizontalTicker from "@/components/horizontal-ticker";
import MarketPreviewCard from "@/components/market-preview-card";
import AboutSection from "@/components/about-section";
import { useMarkets } from "@/hooks/use-markets";
import { marketAPI } from "@/lib/api-client";
import { useGlobalContext } from "@/lib/contexts/GlobalContext";

export default function Home() {
  const { formatMarketData } = useGlobalContext();
  const { markets: activeMarkets } = useMarkets("active");
  const { markets: closedMarkets } = useMarkets("closed");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [formatMarketData]);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-6xl font-bold text-[#0b1f3a] mb-2">
          Prediction Markets on Solana
        </h1>
        <p className="text-lg md:text-xl text-[#0b1f3a] opacity-70">
          Trade on the future. Powered by decentralized markets.
        </p>
      </div>

      {activeMarkets.length > 0 && (
        <HorizontalTicker
          title="Active Markets"
          items={activeMarkets}
          speedMs={40_000}
          renderItem={(market) => (
            <MarketPreviewCard
              key={market.id}
              {...market}
              className="w-[320px] md:w-[360px] h-[320px] overflow-hidden shrink-0"
            />
          )}
        />
      )}

      {closedMarkets.length > 0 && (
        <HorizontalTicker
          title="Closed Markets"
          items={closedMarkets}
          speedMs={35_000}
          reverse
          renderItem={(market) => (
            <MarketPreviewCard
              key={market.id}
              {...market}
              className="w-[320px] md:w-[360px] h-[320px] overflow-hidden shrink-0"
            />
          )}
        />
      )}

      {activeMarkets.length === 0 && closedMarkets.length === 0 && (
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
  );
}

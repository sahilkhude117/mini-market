"use client";

import { useEffect, useState } from "react";
import { useGlobalContext, MarketDataType } from "@/lib/contexts/GlobalContext";
import { marketAPI } from "@/lib/api-client";
import MarketPreviewCard from "@/components/market-preview-card";
import { toMarketPreview } from "@/lib/data-adapters";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketsPage() {
  const { activeTab, markets, setActiveTab, formatMarketData } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadMarkets();
  }, [activeTab, page]);

  const loadMarkets = async () => {
    try {
      setLoading(true);
      const data = await marketAPI.get({
        marketStatus: activeTab,
        page,
        limit: 12,
      });
      formatMarketData(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to load markets:", error);
    } finally {
      setLoading(false);
    }
  };

  const marketPreviews = markets.map(toMarketPreview);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0b1f3a]">Markets</h1>
        
        {/* Tab Navigation */}
        <div className="flex gap-2">
          {(["ACTIVE", "CLOSED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl font-bold border-2 transition-colors ${
                activeTab === tab
                  ? "bg-[#0b1f3a] text-white border-black"
                  : "bg-white text-[#0b1f3a] border-black hover:bg-neutral-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="text-xl font-bold text-[#0b1f3a]">Loading markets...</div>
        </div>
      ) : markets.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-[#0b1f3a] mb-4">No markets found</h2>
          <p className="text-lg text-[#0b1f3a] opacity-70 mb-6">
            Be the first to create a market!
          </p>
          <Link href="/create">
            <Button className="px-6 py-3 rounded-xl bg-[#0b1f3a] text-white font-bold border-2 border-black hover:bg-[#174a8c]">
              Create Market
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Markets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {marketPreviews.map((market) => (
              <MarketPreviewCard key={market.id} {...market} className="w-full" />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-6 py-2 rounded-xl font-bold border-2 ${
                  page === 1
                    ? "bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed"
                    : "bg-white text-[#0b1f3a] border-black hover:bg-neutral-100"
                }`}
              >
                Previous
              </button>
              <span className="flex items-center px-4 font-bold text-[#0b1f3a]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-6 py-2 rounded-xl font-bold border-2 ${
                  page === totalPages
                    ? "bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed"
                    : "bg-white text-[#0b1f3a] border-black hover:bg-neutral-100"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useGlobalContext, MarketDataType } from "@/lib/contexts/GlobalContext";
import { marketAPI } from "@/lib/api-client";
import { getCountDown, formatNumber } from "@/lib/prediction-utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        limit: 10,
      });
      formatMarketData(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to load markets:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (market: MarketDataType) => {
    const totalA = market.playerACount || 0;
    const totalB = market.playerBCount || 0;
    const total = totalA + totalB;
    if (total === 0) return 50;
    return Math.round((totalA / total) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Prediction Markets</h1>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {(["ACTIVE", "PENDING", "CLOSED", "INIT"] as const).map((tab) => (
            <Button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              variant={activeTab === tab ? "default" : "outline"}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading markets...</div>
      ) : markets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">No markets found</p>
          <Link href="/propose">
            <Button>Create a Market</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Markets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {markets.map((market) => {
              const yesPercentage = calculatePercentage(market);
              const timeLeft = getCountDown(market.date);

              return (
                <Card key={market._id} className="p-6">
                  <div className="mb-4">
                    {market.imageUrl && (
                      <img
                        src={market.imageUrl}
                        alt={market.question}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-2">{market.question}</h3>
                    <p className="text-sm text-gray-500 mb-2">{market.description}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Volume:</span>
                      <span className="font-semibold">
                        {formatNumber(market.totalInvestment || 0)} SOL
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time Left:</span>
                      <span className="font-semibold">{timeLeft}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className="font-semibold">{market.marketStatus}</span>
                    </div>
                  </div>

                  {/* Yes/No Percentage Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-green-500">YES {yesPercentage}%</span>
                      <span className="text-red-500">NO {100 - yesPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${yesPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/markets/${market._id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {market.marketStatus === "ACTIVE" && (
                      <Link href={`/markets/${market._id}/bet`} className="flex-1">
                        <Button className="w-full">Place Bet</Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

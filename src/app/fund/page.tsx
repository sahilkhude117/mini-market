"use client";

import { useEffect, useState } from "react";
import { useWalletUi } from "@wallet-ui/react";
import { marketAPI } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { MarketDataType } from "@/lib/contexts/GlobalContext";

export default function FundPage() {
  const { account } = useWalletUi();
  const publicKey = account?.address;
  const [markets, setMarkets] = useState<MarketDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fundingMarket, setFundingMarket] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState("");

  useEffect(() => {
    loadPendingMarkets();
  }, []);

  const loadPendingMarkets = async () => {
    try {
      setLoading(true);
      const data = await marketAPI.get({
        marketStatus: "PENDING",
        page: 1,
        limit: 20,
      });
      setMarkets(data.data);
    } catch (error) {
      console.error("Failed to load markets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFund = async (marketId: string) => {
    if (!publicKey || !fundAmount) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setFundingMarket(marketId);
      
      // Call backend API to add liquidity
      await marketAPI.liquidity({
        market_id: marketId,
        amount: parseFloat(fundAmount),
        investor: publicKey.toString(),
        active: parseFloat(fundAmount) >= 1, // Activate if funded >= 1 SOL
      });

      toast.success("Market funded successfully!");
      setFundAmount("");
      setFundingMarket(null);
      await loadPendingMarkets();
    } catch (error: any) {
      console.error("Failed to fund market:", error);
      toast.error(error.response?.data?.error || "Failed to fund market");
    } finally {
      setFundingMarket(null);
    }
  };

  if (!publicKey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="mb-6">Please connect your wallet to fund markets</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Fund Markets</h1>
        <p className="text-gray-600">
          Provide liquidity to pending markets and earn trading fees
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading markets...</div>
      ) : markets.length === 0 ? (
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">No Pending Markets</h2>
          <p className="mb-6">There are no markets waiting for funding right now</p>
          <Link href="/propose">
            <Button>Propose a Market</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {markets.map((market) => (
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
                  <span>Creator:</span>
                  <span className="font-mono text-xs">
                    {market.creator.slice(0, 6)}...{market.creator.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current Liquidity:</span>
                  <span className="font-semibold">
                    {market.totalInvestment || 0} SOL
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Target Value:</span>
                  <span className="font-semibold">{market.value}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expires:</span>
                  <span className="font-semibold">
                    {new Date(market.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <Label>Fund Amount (SOL)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="0.0"
                    step="0.1"
                    min="0.1"
                  />
                  <Button
                    onClick={() => handleFund(market._id)}
                    disabled={fundingMarket === market._id || !fundAmount}
                  >
                    {fundingMarket === market._id ? "Funding..." : "Fund"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  ℹ️ Earn 1% of trading fees as a liquidity provider
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

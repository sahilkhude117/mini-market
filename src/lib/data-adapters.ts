import type { MarketDataType } from "@/lib/contexts/GlobalContext";
import type { MarketPreviewCardProps } from "@/components/market-preview-card";
import type { PositionCardProps } from "@/components/position-card";

/**
 * Adapts Mini Market API response to MarketPreviewCard props
 */
export function toMarketPreview(apiMarket: MarketDataType): MarketPreviewCardProps {
  // Calculate current probability based on token prices
  const totalPrice = apiMarket.tokenAPrice + apiMarket.tokenBPrice;
  const yesProbability = totalPrice > 0 ? (apiMarket.tokenAPrice / totalPrice) * 100 : 50;

  // Generate mock price series based on current probability
  // In production, this should come from historical data
  const priceSeries = generateMockPriceSeries(yesProbability);

  // Determine status
  const status: "active" | "closed" | "resolved" = 
    apiMarket.marketStatus === "ACTIVE" ? "active" :
    apiMarket.marketStatus === "CLOSED" ? "closed" : "resolved";

  // Parse resolution date
  const resolutionDate = new Date(apiMarket.date).getTime();

  return {
    id: apiMarket._id,
    logoUrl: apiMarket.imageUrl,
    title: apiMarket.question,
    description: apiMarket.description || "No description available",
    resolutionDate,
    status,
    currentProbability: yesProbability,
    priceSeries,
  };
}

/**
 * Generate mock price series for sparkline chart
 * In production, this should be replaced with actual historical data
 */
function generateMockPriceSeries(currentPrice: number, points: number = 20): number[] {
  const series: number[] = [];
  let price = currentPrice;
  
  for (let i = 0; i < points; i++) {
    // Add some random variation
    const variation = (Math.random() - 0.5) * 10;
    price = Math.max(10, Math.min(90, price + variation));
    series.push(price);
  }
  
  // Ensure the last point is the current price
  series[series.length - 1] = currentPrice;
  
  return series;
}

/**
 * Adapts user position data to PositionCard props
 * This is a placeholder - you'll need to integrate with your actual position data
 */
export function toPosition(
  marketData: MarketDataType,
  userBet: {
    amount: number;
    isYes: boolean;
    timestamp: number;
  }
): PositionCardProps["position"] {
  const totalPrice = marketData.tokenAPrice + marketData.tokenBPrice;
  const currentProbability = totalPrice > 0 ? (marketData.tokenAPrice / totalPrice) : 0.5;
  
  // Calculate current value and PnL
  const entryProbability = 0.5; // This should come from actual entry data
  const shares = userBet.amount / (userBet.isYes ? marketData.tokenAPrice : marketData.tokenBPrice);
  const currentValue = shares * (userBet.isYes ? marketData.tokenAPrice : marketData.tokenBPrice);
  const pnl = currentValue - userBet.amount;

  const status: "active" | "closed" | "claimed" = 
    marketData.marketStatus === "ACTIVE" ? "active" :
    marketData.marketStatus === "CLOSED" ? "closed" : "claimed";

  return {
    id: `${marketData._id}-${userBet.timestamp}`,
    marketId: marketData._id,
    marketTitle: marketData.question,
    marketLogoUrl: marketData.imageUrl,
    side: userBet.isYes ? "YES" : "NO",
    shares,
    investedAmount: userBet.amount,
    currentValue: status === "active" ? currentValue : undefined,
    pnl: status === "active" ? pnl : undefined,
    status,
    resolvedOutcome: status === "closed" ? (Math.random() > 0.5 ? "YES" : "NO") : undefined,
  };
}

/**
 * Calculate market statistics
 */
export function calculateMarketStats(market: MarketDataType) {
  const totalPrice = market.tokenAPrice + market.tokenBPrice;
  const yesProbability = totalPrice > 0 ? (market.tokenAPrice / totalPrice) * 100 : 50;
  const noProbability = 100 - yesProbability;
  const totalVolume = market.tradingAmountA + market.tradingAmountB;
  const liquidity = market.totalInvestment || 0;

  return {
    yesProbability,
    noProbability,
    totalVolume,
    liquidity,
    yesPrice: market.tokenAPrice,
    noPrice: market.tokenBPrice,
  };
}

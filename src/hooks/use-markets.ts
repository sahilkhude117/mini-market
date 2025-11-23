"use client";

import { useGlobalContext } from "@/lib/contexts/GlobalContext";
import { toMarketPreview } from "@/lib/data-adapters";
import { useMemo } from "react";

export function useMarkets(filter?: "active" | "closed") {
  const { markets } = useGlobalContext();

  const filteredMarkets = useMemo(() => {
    let filtered = markets;

    if (filter === "active") {
      filtered = markets.filter(m => m.marketStatus === "ACTIVE");
    } else if (filter === "closed") {
      filtered = markets.filter(m => m.marketStatus === "CLOSED");
    }

    return filtered.map(toMarketPreview);
  }, [markets, filter]);

  return {
    markets: filteredMarkets,
    loading: false, // Add actual loading state from your API
    error: null, // Add actual error state from your API
  };
}

export function useMarket(id: string) {
  const { markets } = useGlobalContext();

  const market = useMemo(() => {
    const found = markets.find(m => m._id === id);
    return found ? toMarketPreview(found) : null;
  }, [markets, id]);

  const rawMarket = useMemo(() => {
    return markets.find(m => m._id === id);
  }, [markets, id]);

  return {
    market,
    rawMarket,
    loading: false,
    error: null,
  };
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export type PositionCardProps = {
  position: {
    id: string;
    marketId: string;
    marketTitle: string;
    marketLogoUrl?: string;
    side: "YES" | "NO";
    shares: number;
    investedAmount: number; // in SOL or USD
    currentValue?: number; // in SOL or USD
    pnl?: number; // in SOL or USD
    status: "active" | "closed" | "claimed";
    resolvedOutcome?: "YES" | "NO";
  };
  onClaim?: (positionId: string) => Promise<void>;
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-[#0b1f3a] opacity-60">{label}</span>
      <span className="text-base font-extrabold text-[#0b1f3a]">{value}</span>
    </div>
  );
}

function fmtAmount(n: number): string {
  const sign = n < 0 ? "-" : "";
  const val = Math.abs(n);
  return `${sign}${val.toFixed(2)} SOL`;
}

export default function PositionCard({ position, onClaim }: PositionCardProps) {
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = async () => {
    if (!onClaim || isClaiming) return;
    setIsClaiming(true);
    try {
      await onClaim(position.id);
    } catch (error) {
      console.error("Failed to claim:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const canClaim = position.status === "closed" && position.resolvedOutcome === position.side;
  const isClaimed = position.status === "claimed";

  return (
    <div className="w-full border-4 border-black rounded-2xl p-4 bg-white flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Link
          href={`/markets/${position.marketId}`}
          className="flex items-center gap-3 no-underline hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#174a8c] focus-visible:ring-offset-white rounded-md"
          aria-label={`View market ${position.marketTitle}`}
        >
          {position.marketLogoUrl && (
            <img src={position.marketLogoUrl} alt="logo" className="w-8 h-8 object-contain" />
          )}
          <div>
            <div className="font-extrabold text-[#0b1f3a]">{position.marketTitle}</div>
            <div className="text-sm md:text-base font-bold text-[#0b1f3a] opacity-60">
              {position.status === "active" ? "Active" : position.status === "closed" ? "Closed" : "Claimed"}
            </div>
          </div>
        </Link>
        {canClaim && !isClaimed && (
          <button
            type="button"
            disabled={isClaiming}
            onClick={handleClaim}
            className={`px-4 py-2 rounded-xl border-2 font-bold ${
              isClaiming
                ? "bg-neutral-200 text-neutral-500 border-neutral-400 cursor-not-allowed"
                : "bg-white text-black border-black hover:bg-neutral-100"
            }`}
            aria-disabled={isClaiming}
            aria-busy={isClaiming}
          >
            <span className="inline-flex items-center gap-2">
              {isClaiming && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isClaiming ? "Claiming…" : "Claim"}</span>
            </span>
          </button>
        )}
        {isClaimed && (
          <div className="px-4 py-2 rounded-xl border-2 border-neutral-400 bg-neutral-200 text-neutral-600 font-bold">
            Claimed
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <Stat label="Side" value={position.side} />
        <Stat label="Shares" value={position.shares.toLocaleString()} />
        <Stat label="Invested" value={fmtAmount(position.investedAmount)} />
        {position.currentValue != null ? (
          <Stat label="Current Value" value={fmtAmount(position.currentValue)} />
        ) : (
          <Stat label="Current Value" value="—" />
        )}
        {position.pnl != null && (
          <Stat 
            label="PnL" 
            value={fmtAmount(position.pnl)} 
          />
        )}
        {position.status === "closed" && position.resolvedOutcome && (
          <Stat label="Outcome" value={position.resolvedOutcome} />
        )}
      </div>
    </div>
  );
}

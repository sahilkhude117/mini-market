"use client";

import Sparkline from "./sparkline";
import { useCountdown, useNow } from "@/hooks/use-countdown";
import Link from "next/link";
import { useMemo } from "react";

export type MarketPreviewCardProps = {
  id: string;
  logoUrl?: string;
  title: string;
  description: string;
  resolutionDate: number; // timestamp in ms
  status: "active" | "closed" | "resolved";
  currentProbability?: number; // e.g., 65%
  priceSeries?: number[];
  className?: string;
};

function Badge({
  label,
  value,
  ariaLabel,
}: {
  label: string;
  value: string;
  ariaLabel: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 border-2 border-black bg-white rounded-full px-2 py-0.5 text-xs font-bold text-[#0b1f3a]"
      aria-label={ariaLabel}
    >
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  );
}

function formatDurationShort(ms: number): string {
  if (!isFinite(ms) || ms <= 0) return "0s";
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${s}s`;
}

export default function MarketPreviewCard(props: MarketPreviewCardProps) {
  const {
    id,
    logoUrl,
    title,
    description,
    resolutionDate,
    status,
    currentProbability,
    priceSeries,
    className,
  } = props;

  const now = useNow();
  const { remainingMs, isPast } = useCountdown(resolutionDate);

  const showChart = status === "active" && priceSeries && priceSeries.length > 0;

  const resolutionBadge = {
    label: status === "closed" ? "Resolved" : "Resolution",
    value: status === "closed" 
      ? formatDurationShort(now - resolutionDate) + " ago"
      : new Date(resolutionDate).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
  };

  const previewTimestamps = useMemo(() => {
    const len = priceSeries?.length ?? 0;
    if (len === 0) return [] as number[];
    const end = Date.now();
    const start = end - (len - 1) * 3600_000;
    return Array.from({ length: len }, (_, i) => start + i * 3600_000);
  }, [priceSeries]);

  return (
    <Link
      href={`/markets/${id}`}
      className={
        "block group p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#174a8c] focus-visible:ring-offset-white " +
        (className ?? "")
      }
      aria-label={`Open market ${title}`}
    >
      <div className="h-full bg-white rounded-[calc(1rem-3px)] border-4 border-black p-4 md:p-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md flex flex-col">
        <div className="flex items-start gap-3">
          {logoUrl && (
            <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 overflow-hidden">
              <img
                src={logoUrl}
                alt="Market logo"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg md:text-xl font-extrabold leading-tight text-[#0b1f3a] break-words">
              {title}
            </h3>
            <p className="mt-1 text-sm text-[#0b1f3a] line-clamp-3">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-4 h-24 w-full flex items-center justify-center">
          {showChart ? (
            <Sparkline
              values={priceSeries ?? []}
              height={96}
              className="w-full h-24"
              showCurrentRefLine
              yStartAtZero
              timestamps={previewTimestamps}
            />
          ) : (
            <div className="w-full flex flex-col items-center gap-2">
              <div className="text-sm text-[#0b1f3a] opacity-70">
                {status === "closed" ? "Market Closed" : "No price data"}
              </div>
              {currentProbability != null && (
                <div className="text-2xl font-extrabold text-[#0b1f3a]">
                  {currentProbability.toFixed(1)}%
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge
            label={resolutionBadge.label}
            value={resolutionBadge.value}
            ariaLabel={`${resolutionBadge.label} ${resolutionBadge.value}`}
          />
          {status === "active" && currentProbability != null && (
            <Badge
              label="Current"
              value={`${currentProbability.toFixed(1)}%`}
              ariaLabel={`Current probability ${currentProbability.toFixed(1)}%`}
            />
          )}
        </div>
      </div>
    </Link>
  );
}

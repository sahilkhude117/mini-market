"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ReferenceLine,
} from "recharts";

type SparklineProps = {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string | null;
  className?: string;
  showAxes?: boolean;
  showTooltip?: boolean;
  showCurrentRefLine?: boolean;
  useRainbowGradient?: boolean;
  yDomain?: [number | "auto", number | "auto"];
  showMidline?: boolean;
  midlineValue?: number;
  yStartAtZero?: boolean;
  timestamps?: number[];
};

export default function Sparkline({
  values,
  width,
  height = 80,
  stroke = "#000",
  fill: _fill = null,
  className,
  showAxes = false,
  showTooltip = false,
  showCurrentRefLine = false,
  useRainbowGradient = false,
  yDomain,
  showMidline = false,
  midlineValue = 50,
  yStartAtZero = false,
  timestamps,
}: SparklineProps) {
  if (!values || values.length === 0) {
    return (
      <svg
        width={width || "100%"}
        height={height}
        className={className}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-label="Empty chart"
      >
        <rect width="100" height="100" fill="transparent" />
      </svg>
    );
  }

  const data = useMemo(() => {
    return values.map((v, i) => ({
      index: i,
      value: v,
      timestamp: timestamps?.[i],
    }));
  }, [values, timestamps]);

  const effectiveDomain = useMemo((): [number | "auto", number | "auto"] => {
    if (yDomain) return yDomain;
    if (yStartAtZero) {
      const max = Math.max(...values);
      return [0, Math.max(max, 100)];
    }
    return ["auto", "auto"];
  }, [yDomain, yStartAtZero, values]);

  const currentValue = values[values.length - 1];
  const gradientId = useMemo(() => `gradient-${Math.random().toString(36).substring(7)}`, []);

  return (
    <ResponsiveContainer width={width || "100%"} height={height} className={className}>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        {useRainbowGradient && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6b5b95" />
              <stop offset="50%" stopColor="#174a8c" />
              <stop offset="100%" stopColor="#0b1f3a" />
            </linearGradient>
          </defs>
        )}
        {showAxes && <XAxis dataKey="index" hide={!showAxes} />}
        {showAxes && <YAxis domain={effectiveDomain} hide={!showAxes} />}
        {showTooltip && (
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const value = payload[0].value as number;
              const ts = payload[0].payload?.timestamp;
              return (
                <div className="bg-white border-2 border-black rounded px-2 py-1 text-xs font-bold">
                  {ts && <div>{new Date(ts).toLocaleString()}</div>}
                  <div>{value.toFixed(1)}%</div>
                </div>
              );
            }}
          />
        )}
        {showMidline && <ReferenceLine y={midlineValue} stroke="#ccc" strokeDasharray="3 3" />}
        {showCurrentRefLine && <ReferenceLine y={currentValue} stroke="#0b1f3a" strokeWidth={2} strokeDasharray="5 5" />}
        <Line
          type="monotone"
          dataKey="value"
          stroke={useRainbowGradient ? `url(#${gradientId})` : stroke}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

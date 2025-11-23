"use client";

import { useEffect, useState } from "react";

export function useCountdown(targetMs: number) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const remainingMs = Math.max(0, targetMs - now);
  const isPast = now >= targetMs;

  return { remainingMs, isPast, now };
}

export function useNow() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return now;
}

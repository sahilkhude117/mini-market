"use client";

import React from "react";
import Market from "@/components/elements/marketInfo/Market";
import AutoScrollCarousel from "@/components/elements/carousel/AutoScrollCarousel";
import { useGlobalContext } from "@/providers/GlobalContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const pathname = usePathname();
  const { setActiveTab } = useGlobalContext();
  const [showPending, setShowPending] = useState(false);

  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("ACTIVE");
    }
  }, [pathname, setActiveTab]);

  return (
    <div className="w-full sm:px-[42px] px-5 flex flex-col justify-start items-start gap-[50px] overflow-y-auto overflow-x-hidden">
      <div className="w-full">
        <AutoScrollCarousel />
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-[50px]">
        {/* Toggle between Active and Pending Markets */}
        <div className="w-full flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0b1f3a]">
            {showPending ? "Pending Markets - Need Funding" : "Active Markets"}
          </h2>
          <button
            onClick={() => setShowPending(!showPending)}
            className="px-4 py-2 bg-[#0b1f3a] text-white rounded-lg font-bold hover:bg-[#0b1f3a]/80 transition-colors"
          >
            {showPending ? "Show Active Markets" : "Show Pending Markets"}
          </button>
        </div>
        <div className="w-full">
          <Market showPendingOnHome={showPending} />
        </div>
      </div>
    </div>
  );
}

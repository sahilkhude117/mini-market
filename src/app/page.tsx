"use client";

import React from "react";
import Market from "@/components/elements/marketInfo/Market";
import AutoScrollCarousel from "@/components/elements/carousel/AutoScrollCarousel";
import { useGlobalContext } from "@/providers/GlobalContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const pathname = usePathname();
  const { setActiveTab } = useGlobalContext();

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
        <div className="w-full">
          <Market />
        </div>
      </div>
    </div>
  );
}

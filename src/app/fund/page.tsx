"use client";

import Market from "@/components/elements/marketInfo/Market";
import { useGlobalContext } from "@/providers/GlobalContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function FundMarket() {
  const pathname = usePathname();
  const { setActiveTab } = useGlobalContext(); // Ensure setActiveTab exists in context

  useEffect(() => {
    if (pathname === "/fund") {
      setActiveTab("PENDING"); // Update tab
    }
  }, [pathname, setActiveTab]); // Dependency array ensures it runs on pathname change

  return (
    <div className="w-full sm:px-[42px] px-5 flex flex-col justify-start items-start gap-[50px] overflow-y-auto overflow-x-hidden">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0b1f3a]">Funding Markets</h2>
        </div>
      </div>
      <div className="w-full">
        <Market />
      </div>
    </div>
  );
}

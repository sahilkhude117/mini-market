"use client";

import Link from "next/link";
import { WalletDropdown } from "./wallet-dropdown";
import { User } from "lucide-react";

export function PageHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="relative flex items-center justify-between py-3 px-3 md:px-20 max-w-screen-2xl mx-auto">
        <div className="flex-1" />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <h1 className="text-black text-3xl md:text-5xl lg:text-5xl font-semibold tracking-tight text-center">
            Mini Market
          </h1>
        </div>
        
        <div className="flex items-center gap-3 z-10">
          <Link
            href="/profile"
            aria-label="Profile"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-black bg-white flex items-center justify-center hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#174a8c] focus-visible:ring-offset-white transition-colors"
          >
            <User className="w-6 h-6 md:w-7 md:h-7 text-black" />
          </Link>

          <WalletDropdown />
        </div>
      </div>
    </header>
  );
}

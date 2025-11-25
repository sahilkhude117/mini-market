"use client";

import Link from "next/link";
import { WalletDropdown } from "./wallet-dropdown";
import { useWalletUi } from "@wallet-ui/react";
import { useState } from "react";

export default function PageHeader() {
  const { connected } = useWalletUi();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <header className="relative flex items-center justify-between py-3">
      <Link
        href="/"
        className="flex items-center gap-6 md:gap-8 no-underline hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#174a8c] focus-visible:ring-offset-white rounded-lg"
        aria-label="Go to home"
      >
        <div className="h-8 w-10 md:h-16 md:w-16 overflow-visible">
          <div className="h-full w-full flex items-center justify-center text-4xl md:text-6xl font-bold">
            🔮
          </div>
        </div>
      </Link>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
        <h1 className="text-black text-3xl md:text-5xl lg:text-5xl font-semibold tracking-tight text-center">
          Pythia Markets
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          aria-label="Profile"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-black bg-white flex items-center justify-center hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#174a8c] focus-visible:ring-offset-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 md:w-7 md:h-7 text-black"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="8"
              r="4"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M4 20c1.5-3.5 5-6 8-6s6.5 2.5 8 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Link>

        {connected && (
          <button
            type="button"
            className="px-6 py-3 rounded-2xl bg-black text-white text-lg font-bold border-4 border-black shadow-sm hover:bg-neutral-800 transition-colors"
            onClick={() => setShowCreateModal(true)}
          >
            Create Market
          </button>
        )}

        <div className="wallet-button-wrapper">
          <WalletDropdown />
        </div>
      </div>
    </header>
  );
}

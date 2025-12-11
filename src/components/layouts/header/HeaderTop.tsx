"use client";

import { useState } from "react";
import Icon from "@/components/elements/Icons";
import { useGlobalContext } from "@/providers/GlobalContext";
import { usePathname } from "next/navigation";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import {
  WalletMultiButton,
  WalletDisconnectButton,
  BaseWalletMultiButton
} from "@solana/wallet-adapter-react-ui";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";

interface HeaderTopProps {
  isCollapsed?: boolean;
}

const HeaderTop: React.FC<HeaderTopProps> = ({ isCollapsed }) => {
  const { activeTab, setActiveTab } = useGlobalContext(); // Use Global Context
  const wallet = useWallet();
  const pathname = usePathname();

  return (
    <div className="flex flex-col relative">
      <div className="self-stretch px-[50px] py-4 flex justify-between items-center w-full max-w-full overflow-x-hidden">
        <div className="flex gap-2 items-center md:hidden">
          <div className="w-4 h-4 md:hidden relative overflow-hidden">
            <RxHamburgerMenu size={16} className="text-[#0b1f3a]" />
          </div>
          <div className="flex-1 md:hidden flex justify-start items-center gap-2">
            <Link href="/">
              <Icon name="Logo" size={24} />
            </Link>
            <Link
              href="/"
              className="text-xl leading-9 font-normal font-['anton'] text-[#0b1f3a] uppercase"
            >
              minimarket
            </Link>
          </div>
        </div>

        <div className="md:flex hidden justify-start items-center gap-5">
          {/* Market Tab Switch */}
          {pathname === "/" ? (
            <div className="p-0.5 bg-gray-100 rounded-[18px] border-2 border-gray-200 flex">
              {/* Active Market Button */}
              <button
                onClick={() => setActiveTab("ACTIVE")}
                className={`px-4 py-2.5 rounded-2xl flex items-center cursor-pointer gap-2 transition-all duration-300
        ${activeTab === "ACTIVE"
                    ? "bg-white border-b-4 border-[#0b1f3a] font-extrabold"
                    : "bg-transparent hover:bg-gray-50 hover:shadow-md"
                  }`}
              >
                <Icon
                  name="ActiveMarket"
                  color={activeTab === "ACTIVE" ? "#0b1f3a" : "#838587"}
                  className="transition-all duration-300 ease-in-out hover:scale-110"
                />
                <span
                  className={`text-base font-medium font-satoshi leading-normal transition-all duration-300 ease-in-out
          ${activeTab === "ACTIVE" ? "text-[#0b1f3a] font-extrabold" : "text-[#838587] opacity-70"}`}
                >
                  Active Market
                </span>
              </button>

              {/* Pending Market Button */}
              <button
                onClick={() => setActiveTab("PENDING")}
                className={`px-4 py-2.5 rounded-2xl flex items-center cursor-pointer gap-2 transition-all duration-300
        ${activeTab === "PENDING"
                    ? "bg-white border-b-4 border-[#0b1f3a] font-extrabold"
                    : "bg-transparent hover:bg-gray-50 hover:shadow-md"
                  }`}
              >
                <Icon
                  name="PendingMarket"
                  color={activeTab === "PENDING" ? "#0b1f3a" : "#838587"}
                  className="transition-all duration-300 ease-in-out hover:scale-110"
                />
                <span
                  className={`text-base font-medium font-satoshi leading-normal transition-all duration-300 ease-in-out
          ${activeTab === "PENDING" ? "text-[#0b1f3a] font-extrabold" : "text-[#838587] opacity-70"}`}
                >
                  Pending Market
                </span>
              </button>
            </div>
          ) : (
            ""
          )}

          {/* Search Bar */}
          <div className="2xl:w-[480px] hidden px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl lg:flex lg:w-auto justify-start items-center gap-3">
            <span className="pointer-events-none">
              <Icon name="Search" />
            </span>
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent hover:text-gray-600 text-[#838587] text-base font-medium font-satoshi leading-normal outline-none"
            />
            <div className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-lg flex justify-center items-center gap-2.5">
              <span className="text-[#838587] cursor-pointer text-sm font-medium font-satoshi leading-none">
                ⌘V
              </span>
            </div>
          </div>
        </div>

        {/* Language Selector & Wallet Button */}
        <div className="flex justify-end items-center gap-2 md:gap-3 lg:gap-5 flex-shrink-0">
          {/* Language Selector */}
          <div
            className="px-3 md:px-4 py-2.5 bg-gray-100 border-2 border-gray-200 rounded-2xl lg:flex hidden justify-center items-center gap-2 
    transition-all duration-300 ease-in-out hover:bg-gray-200 hover:shadow-md cursor-pointer flex-shrink-0"
          >
            <span className="text-[#0b1f3a] text-lg font-medium font-satoshi leading-7 transition-all duration-300 ease-in-out hover:text-[#174a8c]">
              EN
            </span>
            <Icon
              name="Down"
              color="#0b1f3a"
              className="transition-all duration-300 ease-in-out hover:rotate-180"
            />
          </div>

          {/* Connect Wallet Button */}
          {/* <button
            onClick={
              () => {
                if (wallet.connected) {
                  wallet.disconnect();
                } else {
                  wallet.connect();
                }
              }
            }
            className="md:px-4 px-3 md:py-2.5 py-1 bg-[#07b3ff] rounded-2xl flex items-center gap-2 transition-all cursor-pointer duration-300 ease-in-out hover:bg-[#0595d3] hover:scale-105 hover:shadow-lg"
          >
            <span className="text-black md:text-lg text-sm font-medium font-satoshi leading-7 transition-all duration-300 ease-in-out">
              Connect Wallet
            </span>
          </button> */}
          <WalletMultiButton style={{ borderRadius: "15px", backgroundColor: "#0b1f3a", color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", border: "2px solid #0b1f3a" }} ></WalletMultiButton>
        </div>
      </div>
      <div className="px-[50px]">
        {/* Search Bar */}
        <div className="lg:hidden px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl flex justify-start items-center gap-3">
          <span className="cursor-pointer">
            <Icon name="Search" />
          </span>
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent text-[#838587] md:text-base text-sm font-medium font-satoshi leading-normal outline-none"
          />
          <div className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-lg flex justify-center items-center gap-2.5">
            <span className="text-[#838587] cursor-pointer text-sm font-medium font-satoshi leading-none">
              ⌘V
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;

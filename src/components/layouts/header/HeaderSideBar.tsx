"use client";

import Icon from "@/components/elements/Icons";
import Link from "next/link";
import SidebarNav from "../partials/SidebarNav";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { RxCross2 } from "react-icons/rx";

interface HeaderSideBarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isCancel?: boolean;
  setIsCanceled?: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderSideBar = ({ isCollapsed, setIsCollapsed, isCancel, setIsCanceled }: HeaderSideBarProps) => {
  const { width } = useWindowSize();

  return (
    <div
      className={`hidden md:flex fixed top-0 left-0 h-screen z-30 ${isCollapsed ? "w-[104px]" : "w-[280px]"} bg-white border-r-2 border-gray-200 flex-col transition-all duration-300`}
    >
      {/* Logo and Text */}
      <div
        className={`md:flex hidden flex-none items-center h-20 py-[30px] shrink-0 self-stretch transition-all duration-300 ${isCollapsed ? "justify-center" : "justify-start pr-6"
          }`}
      >
        <Link href="/" className="flex items-center">
          <img 
            src="/images/mini-market-logo.png" 
            alt="Mini Market Logo" 
            className="w-20 h-20 object-contain"
          />
          {!isCollapsed && (
            <span className="text-4xl leading-9 font-['anton'] text-[#0b1f3a] uppercase">
              <span className="font-bold">MINI</span>
              <span className="font-normal">MARKET</span>
            </span>
          )}
        </Link>
      </div>

      <div className="md:hidden self-stretch h-[60px] px-5 py-3 inline-flex justify-start items-center gap-2">
        <div
          onClick={() => setIsCanceled && setIsCanceled(!isCancel)}
          className="w-4 h-4 relative overflow-hidden"
        >
          <RxCross2 className="text-[#0b1f3a]" />
        </div>
        <div className="flex-1 flex justify-start items-center gap-0.5">
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
        <div className="px-3 py-1.5 bg-gray-100 rounded-xl border-2 border-gray-200 flex justify-start items-center gap-1">
          <div className="justify-start text-[#0b1f3a] text-sm font-medium font-satoshi leading-normal">
            EN
          </div>
          <Icon
            name="Down"
            className="transition-all duration-300 ease-in-out hover:rotate-180"
          />
        </div>
      </div>

      {/* Sidebar Navigation */}
      <SidebarNav isCollapsed={isCollapsed} />

      <div
        data-size="Small"
        data-type="Tertiary"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`w-8 p-2  ${isCollapsed ? "left-[120px] top-[56px]" : "left-[296px] top-[56px]"
          } absolute origin-top-left hover:bg-gray-200 rotate-180 cursor-pointer bg-gray-100 border-2 border-gray-200 rounded-2xl md:inline-flex hidden justify-start items-center gap-2`}
      >
        <div className="inline-flex flex-col justify-start items-start overflow-hidden">
          <div className="rounded-[3px]" />
          <div className="w-4 h-4 overflow-hidden outline-[1.50px] outline-offset-[-0.75px] outline-[#0b1f3a]">
            <Icon
              name={isCollapsed ? "ArrowRight" : "ArrowLeft"}
              color={"#0b1f3a"}
              size={16}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSideBar;

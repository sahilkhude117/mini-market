"use client";
import { SidebarNavProps } from "@/types/type";
import SidebarNavItem from "./SidebarNavItem";
import { useState } from "react";

const sidebarNavList = [
  { label: "Home", href: "/" },
  { label: "FundMarket", href: "/fund" },
  { label: "ProposeMarket", href: "/propose" },
  { label: "Referral", href: "/referral" },
  { label: "Profile", href: "/profile" },
] as const;

const SidebarNav: React.FC<SidebarNavProps> = ({ isCollapsed }) => {
  // Set the default active item to "Home"
  const [activeItem, setActiveItem] = useState<string>("Home");

  return (
    <nav className="flex grow p-6 flex-col items-start gap-5 flex-[1_0_0] relative self-stretch">
      {sidebarNavList.map(({ label, href }) => (
        <SidebarNavItem
          key={label}
          label={label}
          href={href}
          isActive={activeItem === label}
          onClick={() => setActiveItem(label)}
          isCollapsed={isCollapsed} // Pass the prop
        />
      ))}
    </nav>
  );
};

export default SidebarNav;

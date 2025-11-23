"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({
  href,
  label,
  active,
}: {
  href?: string;
  label: string;
  active?: boolean;
}) {
  const common =
    "px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-sm md:text-base font-extrabold";
  const activeCls = "text-[#0b1f3a] border-b-4 border-[#0b1f3a]";
  const inactiveCls = "text-[#0b1f3a] opacity-70 hover:opacity-100";

  if (!href) {
    return (
      <span className={common + " " + inactiveCls} aria-disabled>
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={common + " " + (active ? activeCls : inactiveCls)}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

export function CategoryNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isActiveMarkets = pathname === "/markets" || pathname?.startsWith("/markets?");
  const isCreate = pathname === "/create";
  const isProfile = pathname === "/profile";

  return (
    <nav className="bg-white border-b border-neutral-200">
      <div className="max-w-screen-2xl mx-auto px-3 md:px-20 py-2 md:py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <NavItem href="/" label="Home" active={isHome} />
          <NavItem href="/markets" label="Markets" active={isActiveMarkets} />
          <NavItem href="/create" label="Create Market" active={isCreate} />
          <NavItem href="/profile" label="Profile" active={isProfile} />
        </div>
      </div>
    </nav>
  );
}

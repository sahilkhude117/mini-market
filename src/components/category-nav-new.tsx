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
      <span className={common + " " + inactiveCls} aria-disabled="true">
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

export default function CategoryNav() {
  const pathname = usePathname();
  const isTrending = pathname === "/";
  const isPublic = pathname === "/public";
  const isProfile = pathname === "/profile";

  return (
    <nav className="mt-2 md:mt-3">
      <div className="flex items-center gap-3 md:gap-4">
        <NavItem href="/" label="Trending" active={isTrending} />
        <NavItem href="/public" label="Public Markets" active={isPublic} />
        <NavItem href="/profile" label="Your Markets" active={isProfile} />
      </div>
    </nav>
  );
}

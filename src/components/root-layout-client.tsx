"use client";

import { ReactNode } from "react";
import PageHeader from "./page-header-new";
import CategoryNav from "./category-nav-new";

export default function RootLayoutClient({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-black">
        <div className="mx-auto max-w-screen-2xl px-3 md:px-6 pt-2">
          <PageHeader />
          <CategoryNav />
        </div>
      </header>
      <main className="mx-auto max-w-screen-2xl px-3 md:px-20 pt-4 pb-10">
        {children}
      </main>
    </>
  );
}

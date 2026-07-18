"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { NAV_ITEMS } from "@/utils/constants";

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-10 flex items-center justify-between gap-1 border-t border-black/5 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2.5 shadow-nav backdrop-blur">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-medium transition-colors",
              isActive ? "text-brand" : "text-ink/40"
            )}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.25 : 1.75}
              className={isActive ? "text-brand" : "text-ink/40"}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

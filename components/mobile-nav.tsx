"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiHomeLine,
  RiCalendarLine,
  RiStockLine,
  RiSettingsLine,
  RiBoxingLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: RiHomeLine },
  { href: "/week", label: "Week", icon: RiCalendarLine },
  { href: "/progress", label: "Progress", icon: RiStockLine },
  { href: "/settings", label: "Settings", icon: RiSettingsLine },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation - Hidden on Desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors",
                  "min-w-[64px] min-h-[56px]",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className={cn("h-5 w-5", isActive && "fill-primary/20")}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar - Hidden on Mobile */}
      <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <RiBoxingLine className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Fitness Tracker</h2>
                <p className="text-xs text-muted-foreground">Hybrid Training</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t text-xs text-muted-foreground">
            <p>Advanced Hybrid Training</p>
            <p>Strength + Cardio Program</p>
          </div>
        </div>
      </aside>
    </>
  );
}

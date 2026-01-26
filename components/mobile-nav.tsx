"use client";

import { cn } from "@/lib/utils";
import {
  RiCalendarFill,
  RiCalendarLine,
  RiHomeFill,
  RiHomeLine,
  RiSettingsFill,
  RiSettingsLine,
  RiStockFill,
  RiStockLine,
} from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./logo";

const navItems = [
  { href: "/", label: "Dashboard", icon: RiHomeLine, fillicon: RiHomeFill },
  {
    href: "/week",
    label: "Week",
    icon: RiCalendarLine,
    fillicon: RiCalendarFill,
  },
  {
    href: "/progress",
    label: "Progress",
    icon: RiStockLine,
    fillicon: RiStockFill,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: RiSettingsLine,
    fillicon: RiSettingsFill,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation - Hidden on Desktop */}
      <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed right-0 bottom-0 left-0 z-50 shadow-[0_-2px_16px_rgba(0,0,0,0.1)] backdrop-blur md:hidden dark:shadow-[0_-2px_16px_rgba(0,0,0,0.5)]">
        <div className="flex h-20 items-start justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const FillIcon = item.fillicon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            const NavIcon = isActive ? FillIcon : Icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 text-xs transition-colors",
                  "min-h-[56px] min-w-[64px]",
                  {
                    "text-primary": isActive,
                    "text-muted-foreground hover:text-foreground": !isActive,
                  }
                )}
              >
                <NavIcon
                  className={cn("h-5 w-5", {
                    "fill-primary": isActive,
                  })}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar - Hidden on Mobile */}
      <aside className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 bottom-0 left-0 z-50 hidden w-64 border-r backdrop-blur md:block">
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="border-b p-6">
            <div className="flex items-center gap-3">
              <Logo className="text-primary size-10" />
              <div>
                <h2 className="text-lg font-bold">RunRep</h2>
                <p className="text-muted-foreground text-xs">Hybrid Training</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const FillIcon = item.fillicon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const NavIcon = isActive ? FillIcon : Icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 transition-all",
                      {
                        "bg-primary/10 text-primary font-medium": isActive,
                        "text-muted-foreground hover:bg-accent hover:text-foreground":
                          !isActive,
                      }
                    )}
                  >
                    <NavIcon
                      className={cn("h-5 w-5", {
                        "fill-primary": isActive,
                      })}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="text-muted-foreground border-t p-4 text-xs">
            <p>Advanced Hybrid Training</p>
            <p>Strength + Cardio Program</p>
          </div>
        </div>
      </aside>
    </>
  );
}

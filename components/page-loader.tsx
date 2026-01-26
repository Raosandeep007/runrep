"use client";

import Logo from "./logo";

export function PageLoader() {
  return (
    <div
      className={`bg-background flex h-screen items-center justify-center opacity-100 transition-opacity duration-500`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* App Icon with Animation */}
        <div className="relative">
          <Logo className="relative flex size-24 items-center justify-center" />
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-foreground mb-2 text-3xl font-bold">RunRep</h1>
          <p className="text-muted-foreground text-sm">
            Strength + Running Tracker
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="flex gap-2">
          <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
          <div
            className="bg-primary h-2 w-2 animate-pulse rounded-full"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="bg-primary h-2 w-2 animate-pulse rounded-full"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </div>
  );
}

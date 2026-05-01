"use client";

import React, { useState, useEffect } from "react";
import Preloader from "@/components/ui/Preloader";
import SmoothScroll from "@/providers/SmoothScroll";
import { cn } from "@/lib/utils";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  // Lock scrolling while preloader is active
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      {/* Hide the main content slightly while loading to prevent a flash of unstyled content */}
      <div className={cn("transition-opacity duration-700", isLoading ? "opacity-0" : "opacity-100")}>
        <SmoothScroll>
          <main className="relative min-h-screen">
            {children}
          </main>
        </SmoothScroll>
      </div>
    </>
  );
}
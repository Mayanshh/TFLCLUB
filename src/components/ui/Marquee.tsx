"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "@/data/backedBy.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function KineticPartnerMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const marqueeInner = marqueeRef.current;
    if (!marqueeInner) return;

    // 1. Create the base infinite loop
    // We move -50% because the content is duplicated exactly once
    const loop = gsap.to(marqueeInner, {
      xPercent: -50,
      ease: "none",
      duration: 20, // Base speed (seconds per loop)
      repeat: -1,
    });

    // 2. Scroll-Linked Velocity Logic
    // This adjusts the 'timeScale' (speed/direction) based on scroll velocity
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        const direction = velocity > 0 ? 1 : -1; // 1 for down, -1 for up
        
        // Calculate a target speed based on how fast the user is scrolling
        // The '3' is a multiplier for intensity, '1' is the minimum base speed
        const targetTimeScale = (Math.abs(velocity) / 200 + 1) * direction;

        // Smoothly tween the marquee speed to the target speed
        gsap.to(loop, {
          timeScale: targetTimeScale,
          duration: 0.5,
          ease: "power2.out",
        });
      },
      // Reset to base speed when scrolling stops
      onToggle: (self) => {
        if (!self.isActive) {
          gsap.to(loop, { timeScale: 1, duration: 1 });
        }
      }
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="w-full bg-[#fffef1] py-20 overflow-hidden border-y border-zinc-200"
    >
      <div className="relative flex items-center">
        <div 
          ref={marqueeRef} 
          className="flex whitespace-nowrap will-change-transform"
        >
          {/* Render the list twice for a seamless infinite bridge */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              {data.partners.map((partner, index) => (
                <div
                  key={`${partner}-${index}`}
                  className="flex items-center"
                >
                  <span className="text-[5vw] dirtyline normal-case md:text-[3.5vw] font-black tracking-wide text-zinc-950 px-10">
                    {partner}
                  </span>
                  {/* Visual separator: a sleek dot or dash */}
                  <div className="w-4 h-4 md:w-4 md:h-4 rounded-full bg-zinc-950 mx-4" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
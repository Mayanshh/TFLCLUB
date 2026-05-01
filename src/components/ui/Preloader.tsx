"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null); // Target specifically for the counter
  const [percentage, setPercentage] = useState(0);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // As soon as the curtain is fully up, unmount the preloader
        onComplete(); 
      },
    });

    // 1. Counter Object for precise number tweening
    const counter = { val: 0 };
    tl.to(counter, {
      val: 100,
      duration: 2.8,
      ease: "power4.inOut",
      onUpdate: () => {
        setPercentage(Math.round(counter.val));
      },
    });

    // 2. Fade out the counter text first
    tl.to(contentRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
    });

    // 3. The "Curtain Reveal" using Clip Path on the ENTIRE container
    tl.to(container.current, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 1.2,
      ease: "expo.inOut",
    });

  }, { scope: container });

  return (
    <div
      ref={container}
      // Added z-[99999] with brackets for Tailwind arbitrary values
      className="fixed inset-0 z-99999 flex flex-col items-center justify-center bg-zinc-950 text-[#fffef1] overflow-hidden"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }} // Establish the initial clip-path state
    >
      {/* Bottom Right Counter */}
      <div 
        ref={contentRef} 
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 flex flex-col items-end"
      >
        <div className="flex items-baseline font-dirtyline">
          <span className="text-6xl md:text-[8vw] leading-none tracking-tighter">
            {/* Pads single digits with a 0 (e.g., 00, 09, 10, 100) */}
            {String(percentage).padStart(2, '0')}
          </span>
          <span className="text-xl md:text-3xl ml-2 font-sans font-bold">%</span>
        </div>
      </div>
    </div>
  );
}
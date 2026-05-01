"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Globe } from "lucide-react";
import data from "@/data/offer.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TimeUnit = ({ value, label }: { value: string; label: string }) => (
  <div className="group relative flex flex-col items-start py-10 md:py-16">
    <span className="text-[12vw] md:text-[10vw] font-black leading-none tracking-tighter text-zinc-950 transition-transform duration-500 group-hover:-translate-y-2 group-hover:skew-x-6">
      {value}
    </span>
    <div className="flex items-center gap-2 mt-2">
      <div className="w-8 h-px bg-zinc-300" />
      <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400">
        {label}
      </span>
    </div>
  </div>
);

export default function EarlyBirdAwwwards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const stickyBtn = useRef<HTMLButtonElement>(null);

  const calculateTimeLeft = useCallback(() => {
    // If timer is not active in JSON, return placeholders
    if (!data.isTimerActive) {
      return { days: "--", hours: "--", mins: "--", secs: "--" };
    }

    const target = new Date(data.targetDate).getTime();
    const now = new Date().getTime();
    const distance = target - now;

    if (distance < 0) return { days: "00", hours: "00", mins: "00", secs: "00" };

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, "0"),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0"),
      mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0"),
      secs: Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, "0"),
    };
  }, []);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!data.isTimerActive) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // Magnetic Button Logic
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!stickyBtn.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = stickyBtn.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.35;
    const y = (clientY - (top + height / 2)) * 0.35;
    gsap.to(stickyBtn.current, { x, y, duration: 0.4, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(stickyBtn.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
  };

  useGSAP(() => {
    gsap.fromTo(".split-text", 
      { y: 150, skewY: 8, opacity: 0 },
      { 
        y: 0, 
        skewY: 0, 
        opacity: 1, 
        duration: 1.8, 
        stagger: 0.12, 
        ease: "power4.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
      }
    );

    gsap.to(bgTextRef.current, {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-[#fffef1] py-40 px-6 md:px-12 overflow-hidden">
      
      {/* Ghost Typography Layer */}
      <div ref={bgTextRef} className="absolute dirtyline top-0 right-0 pointer-events-none select-none opacity-[0.04] leading-none font-black text-[35vw] text-zinc-950 whitespace-nowrap will-change-transform">
        {timeLeft.secs === "--" ? "TFL 5" : timeLeft.secs}
      </div>

      <div className="relative z-10 max-w-360 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <Globe className="w-4 h-4 text-zinc-950" />
                {data.isTimerActive && (
                  <div className="absolute inset-0 w-4 h-4 border border-zinc-950 rounded-full animate-ping opacity-20" />
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-950">
                {data.tag}
              </span>
            </div>
            
            <h2 className="dirtyline text-[11vw] lg:text-[9vw] font-black leading-[0.8] uppercase tracking-tight text-zinc-950">
              <div className="mt-5 lowercase">
                <span className="split-text block">{data.heading}</span>
              </div>
              <div className="uppercase mt-5 tracking-wide">
                <span className="split-text block text-zinc-300 italic">{data.highlight}</span>
              </div>
            </h2>
          </div>

          <div className="lg:col-span-4 pb-4">
            <p className="text-xl md:text-2xl nohemi font-medium leading-tight text-zinc-500 max-w-sm tracking-tight">
              {data.subtitle}
            </p>
          </div>
        </div>

        {/* Counter Grid */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 border-t border-zinc-200">
          <TimeUnit value={timeLeft.days} label="Days" />
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <TimeUnit value={timeLeft.mins} label="Minutes" />
          <TimeUnit value={timeLeft.secs} label="Seconds" />
        </div>

        <div className="mt-40 flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
          <div className="max-w-md border-l-2 border-zinc-950 pl-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400 mb-3 block">Access Protocol</span>
            <p className="text-xl font-bold uppercase tracking-tighter text-zinc-950 leading-tight">
              {data.availability}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-12 w-full md:w-auto">
            <button 
              ref={stickyBtn}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative group h-48 w-48 rounded-full bg-zinc-950 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-2xl"
            >
              <div className="flex flex-col items-center text-[#fffef1] transition-transform duration-500 group-hover:scale-110">
                <ArrowUpRight className="w-8 h-8 mb-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                <span className="text-[11px] uppercase font-black tracking-widest text-center px-6 leading-none">
                  {data.ctaPrimary}
                </span>
              </div>
            </button>

            <button className="group text-sm font-bold uppercase tracking-[0.2em] text-zinc-950 border-b-2 border-zinc-950 pb-2 transition-all hover:text-zinc-400 hover:border-zinc-400">
              {data.ctaSecondary}
            </button>
          </div>
        </div>
      </div>

      {/* Logic Line */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-100">
        <div 
          className="h-full bg-zinc-950 transition-all duration-1000 ease-linear" 
          style={{ 
            width: data.isTimerActive ? `${(parseInt(timeLeft.secs) / 60) * 100}%` : "0%" 
          }} 
        />
      </div>
    </section>
  );
}
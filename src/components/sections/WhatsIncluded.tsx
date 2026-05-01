"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check, X, ArrowDownRight } from "lucide-react";
import data from "@/data/whatsincluded.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Helper to detect which edge the mouse entered/left from
const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): "top" | "bottom" => {
  const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
  const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
  return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
};

// Extracted Component for the Directional Hover Logic (Zero Layout Changes)
const IncludedRow = ({ item, index, setHoverState }: { item: any; index: number; setHoverState: any }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descWrapperRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const animationDefaults = { duration: 0.6, ease: "expo" };

  const handleMouseEnter = (ev: React.MouseEvent<HTMLDivElement>) => {
    setHoverState("included");
    if (!rowRef.current || !bgRef.current || !contentRef.current) return;

    const rect = rowRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap.timeline({ defaults: animationDefaults })
      .set(bgRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(bgRef.current, { y: "0%" }, 0)
      .to(contentRef.current, { color: "#fffef1" }, 0)
      .to(indexRef.current, { color: "#71717a" }, 0) // zinc-500
      .to(titleRef.current, { x: 16 }, 0)
      .to(descWrapperRef.current, { opacity: 1 }, 0)
      .to(descRef.current, { color: "#d4d4d8" }, 0) // zinc-300
      .to(arrowRef.current, { opacity: 1, x: 0 }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLDivElement>) => {
    setHoverState(null);
    if (!rowRef.current || !bgRef.current || !contentRef.current) return;

    const rect = rowRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap.timeline({ defaults: animationDefaults })
      .to(bgRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(contentRef.current, { color: "#09090b" }, 0) // zinc-950
      .to(indexRef.current, { color: "#a1a1aa" }, 0) // zinc-400
      .to(titleRef.current, { x: 0 }, 0)
      .to(descWrapperRef.current, { opacity: 0.7 }, 0)
      .to(descRef.current, { color: "#71717a" }, 0) // zinc-500
      .to(arrowRef.current, { opacity: 0, x: -16 }, 0);
  };

  return (
    <div
      ref={rowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="data-row relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between py-10 border-b border-zinc-200 cursor-none px-6 -mx-6 md:px-10 md:-mx-10 rounded-lg md:rounded-none"
    >
      {/* Absolute Directional Fill Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-zinc-950 translate-y-[101%] pointer-events-none rounded-lg md:rounded-none"
      />

      {/* Content Layer */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between w-full pointer-events-none text-zinc-950"
      >
        <div className="flex items-center gap-8 md:gap-16 w-full md:w-auto">
          <span ref={indexRef} className="text-sm font-mono text-zinc-400">
            0{index + 1}
          </span>
          <h3 ref={titleRef} className="text-3xl md:text-5xl font-bold tracking-tight">
            {item.title}
          </h3>
        </div>
        <div ref={descWrapperRef} className="mt-4 md:mt-0 w-full md:w-1/3 flex justify-between items-center opacity-70">
          <p ref={descRef} className="text-sm md:text-base text-zinc-500 font-medium">
            {item.description}
          </p>
          <span ref={arrowRef} className="opacity-0 -translate-x-4">
            <ArrowDownRight className="w-6 h-6 transform -rotate-90 md:rotate-0" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default function WhatsIncludedElite() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorIconRef = useRef<HTMLDivElement>(null);
  
  const [hoverState, setHoverState] = useState<"included" | "excluded" | null>(null);

  const xMoveCursor = useRef<gsap.QuickToFunc | null>(null);
  const yMoveCursor = useRef<gsap.QuickToFunc | null>(null);

  useGSAP(() => {
    if (cursorRef.current) {
      xMoveCursor.current = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power3.out" });
      yMoveCursor.current = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power3.out" });
    }

    gsap.fromTo(
      ".reveal-text",
      { y: "120%", opacity: 0, skewY: 2 },
      {
        y: "0%",
        opacity: 1,
        skewY: 0,
        duration: 1.8,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      }
    );

    gsap.fromTo(
      ".data-row",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".data-grid",
          start: "top 80%",
        },
      }
    );

    gsap.utils.toArray(".strike-line").forEach((line: any) => {
      gsap.fromTo(
        line,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
          },
        }
      );
    });

  }, { scope: containerRef });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (xMoveCursor.current && yMoveCursor.current) {
      xMoveCursor.current(e.clientX);
      yMoveCursor.current(e.clientY);
    }
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen bg-[#fffef1] text-zinc-950 pb-32 overflow-hidden selection:bg-zinc-900 selection:text-[#fffef1]"
    >
      {/* Custom Floating Cursor Badge */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-24 h-24 rounded-full pointer-events-none z-50 flex items-center justify-center mix-blend-difference transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          hoverState ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } ${hoverState === "included" ? "bg-[#fffef1] text-black" : "bg-zinc-500 text-[#fffef1]"}`}
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div ref={cursorIconRef} className="relative w-full h-full flex items-center justify-center">
          {hoverState === "included" ? (
            <span className="text-xs font-bold tracking-widest uppercase">Yes</span>
          ) : (
            <span className="text-xs font-bold tracking-widest uppercase">No</span>
          )}
        </div>
      </div>

      <div className="max-w-[100vw] mx-auto px-4 md:px-8 pt-32">
        {/* Editorial Header */}
        <div className="mb-24 md:mb-40 flex flex-col items-start normal-case tracking-tighter">
          <p className="overflow-hidden mb-4">
            <span className="reveal-text block dirtyline text-sm md:text-base font-semibold text-zinc-500 tracking-widest">
              / {data.heading}
            </span>
          </p>
          <h2 className="text-[12vw] leading-[0.85] nohemi font-black w-full border-b-2 border-zinc-950 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-0">
            <div className="pt-4">
              <span className="reveal-text nohemi block tracking-tight leading-[0.76] uppercase">{data.title}</span>
            </div>
            <div className="overflow-hidden text-[4vw] lg:text-[2vw] leading-tight font-medium text-zinc-400 max-w-sm tracking-normal normal-case pb-2">
              <span className="reveal-text block">{data.subtitle}</span>
            </div>
          </h2>
        </div>

        {/* The Grid */}
        <div className="data-grid w-full flex flex-col lg:flex-row gap-20">
          
          {/* INCLUDED LIST */}
          <div className="w-full lg:w-2/3 flex flex-col border-t border-zinc-200">
            {data.included.map((item, index) => (
              <IncludedRow key={item.id} item={item} index={index} setHoverState={setHoverState} />
            ))}
          </div>

          {/* EXCLUDED LIST */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-400 mb-10 pl-2">
              ✕ Exclusions
            </h3>
            <div className="flex flex-col gap-8">
              {data.notIncluded.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoverState("excluded")}
                  onMouseLeave={() => setHoverState(null)}
                  className="data-row relative group cursor-none"
                >
                  <div className="relative inline-block">
                    <h4 className="text-2xl md:text-3xl font-semibold text-zinc-400 group-hover:text-zinc-950 transition-colors duration-500">
                      {item.title}
                    </h4>
                    {/* Animated Strikethrough */}
                    <div className="strike-line absolute top-1/2 left-0 w-full h-0.5 bg-zinc-950 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-sm text-zinc-400 mt-2 max-w-xs group-hover:translate-x-2 transition-transform duration-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-15 pt-10 border-zinc-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4 text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-zinc-950 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest">Transparency Note</span>
          </div>
          <p className="text-lg nohemi md:text-xl font-light max-w-2xl text-zinc-600 leading-relaxed">
            {data.footer}
          </p>
        </div>
      </div>
    </section>
  );
}
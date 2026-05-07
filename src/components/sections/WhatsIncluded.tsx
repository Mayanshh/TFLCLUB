"use client";

import React, { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { X, ArrowDownRight, ArrowRight } from "lucide-react";
import data from "@/data/whatsincluded.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): "top" | "bottom" => {
  const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
  const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
  return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
};

/**
 * ROW COMPONENT
 */
const IncludedRow = ({ item, index, setHoverState, onOpen }: { item: any; index: number; setHoverState: any, onOpen: (item: any) => void }) => {
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
      .to(indexRef.current, { color: "#71717a" }, 0)
      .to(titleRef.current, { x: 16 }, 0)
      .to(descWrapperRef.current, { opacity: 1 }, 0)
      .to(descRef.current, { color: "#d4d4d8" }, 0)
      .to(arrowRef.current, { opacity: 1, x: 0 }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLDivElement>) => {
    setHoverState(null);
    if (!rowRef.current || !bgRef.current || !contentRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap.timeline({ defaults: animationDefaults })
      .to(bgRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(contentRef.current, { color: "#09090b" }, 0)
      .to(indexRef.current, { color: "#a1a1aa" }, 0)
      .to(titleRef.current, { x: 0 }, 0)
      .to(descWrapperRef.current, { opacity: 0.7 }, 0)
      .to(descRef.current, { color: "#71717a" }, 0)
      .to(arrowRef.current, { opacity: 0, x: -16 }, 0);
  };

  return (
    <div
      ref={rowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(item)}
      className="data-row relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between py-10 border-b border-zinc-200 cursor-none px-6 -mx-6 md:px-10 md:-mx-10 rounded-lg md:rounded-none transition-all active:scale-[0.98]"
    >
      <div ref={bgRef} className="absolute inset-0 bg-zinc-950 translate-y-[101%] pointer-events-none rounded-lg md:rounded-none" />
      <div ref={contentRef} className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between w-full pointer-events-none text-zinc-950">
        <div className="flex items-center gap-8 md:gap-16 w-full md:w-auto">
          <span ref={indexRef} className="text-sm font-mono text-zinc-400">0{index + 1}</span>
          <h3 ref={titleRef} className="text-3xl md:text-5xl font-semibold tracking-tight uppercase nohemi">{item.title}</h3>
        </div>
        <div ref={descWrapperRef} className="mt-4 md:mt-0 w-full md:w-1/3 flex justify-between items-center opacity-70">
          <p ref={descRef} className="text-sm md:text-base text-zinc-500 font-medium">{item.description}</p>
          <span ref={arrowRef} className="opacity-0 -translate-x-4">
            <ArrowDownRight className="w-6 h-6 transform -rotate-90 md:rotate-0" />
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * MODAL COMPONENT
 */
const DetailModal = ({ item, onClose }: { item: any; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentBodyRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (item) {
      document.body.style.overflow = "hidden";
      
      tl.current = gsap.timeline({ defaults: { ease: "expo.out" } })
        .to(overlayRef.current, { opacity: 1, duration: 0.6 })
        .fromTo(modalRef.current, 
          { y: "100%", skewY: 1 }, 
          { y: "0%", skewY: 0, duration: 0.8, ease: "expo.out" }, "-=0.4")
        .fromTo(contentBodyRef.current?.children || [], 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, "-=0.4");
    }
  }, [item]);

  const handleClose = useCallback(() => {
    if (tl.current) {
      tl.current.reverse().then(() => {
        document.body.style.overflow = "auto";
        onClose();
      });
    }
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-end md:items-center justify-center p-0 md:p-6 lg:p-12">
      {/* Background Overlay */}
      <div 
        ref={overlayRef}
        onClick={handleClose}
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm opacity-0 cursor-pointer" 
      />
      
      {/* Modal Container: h-fit ensures it only grows to content, max-h ensures it stays in view */}
      <div 
        ref={modalRef}
        className="relative w-full h-fit max-h-[85vh] md:max-h-[75vh] max-w-4xl bg-[#fffef1] rounded-t-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl will-change-transform flex flex-col"
      >
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 md:top-8 md:right-8 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-zinc-950 text-[#fffef1] group transition-transform duration-300 hover:scale-90 active:scale-75"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <div ref={contentBodyRef} className="p-8 md:p-16 lg:p-20 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-[0.4em]">
                Inclusives - {item.id}
              </span>
            </div>

            <h2 className="nohemi text-4xl md:text-7xl font-bold text-zinc-950 uppercase leading-[0.9] mb-8 tracking-tight">
              {item.title}
            </h2>
            
            <div 
              className="rich-text-container w-full max-w-2xl text-base md:text-xl text-zinc-600 leading-relaxed font-light space-y-5"
              dangerouslySetInnerHTML={{ __html: item.richText }}
            />

            <div className="mt-12 md:mt-16 w-full flex items-center justify-between border-t border-zinc-100 pt-8">
              <div className="flex items-center gap-4 text-zinc-400 group cursor-default">
                <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center transition-colors group-hover:bg-zinc-950 group-hover:border-zinc-950">
                  <ArrowRight size={16} className="group-hover:text-white transition-colors" />
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Deployment Tier: Global</p>
              </div>
              
              <button 
                onClick={handleClose}
                className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-950"
              >
                <span>Dismiss</span>
                <div className="w-6 h-px bg-zinc-950 origin-right transition-transform duration-500 group-hover:scale-x-150" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1aa;
        }
      `}</style>
    </div>
  );
};

/**
 * MAIN PAGE COMPONENT
 */
export default function WhatsIncludedElite() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hoverState, setHoverState] = useState<"included" | "excluded" | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const xMoveCursor = useRef<gsap.QuickToFunc | null>(null);
  const yMoveCursor = useRef<gsap.QuickToFunc | null>(null);

  useGSAP(() => {
    if (cursorRef.current) {
      xMoveCursor.current = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power3.out" });
      yMoveCursor.current = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power3.out" });
    }

    gsap.fromTo(".reveal-text",
      { y: "120%", opacity: 0, skewY: 2 },
      { y: "0%", opacity: 1, skewY: 0, duration: 1.8, stagger: 0.1, ease: "power4.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
      }
    );

    gsap.fromTo(".data-row",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, stagger: 0.08, ease: "expo.out",
        scrollTrigger: { trigger: ".data-grid", start: "top 80%" }
      }
    );
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
      {/* CUSTOM CURSOR */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-24 h-24 rounded-full pointer-events-none z-300 flex items-center justify-center mix-blend-difference transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          hoverState ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } ${hoverState === "included" ? "bg-[#fffef1] text-black" : "bg-zinc-500 text-[#fffef1]"}`}
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <span className="text-[10px] font-bold tracking-widest uppercase">
          {hoverState === "included" ? "View" : "No"}
        </span>
      </div>

      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      <div className="max-w-[100vw] mx-auto px-4 md:px-8 pt-32">
        <div className="mb-24 md:mb-40 flex flex-col items-start normal-case tracking-tighter">
          <p className="overflow-hidden mb-4">
            <span className="reveal-text block dirtyline text-sm md:text-base font-semibold text-zinc-500 tracking-widest uppercase">
              / {data.heading}
            </span>
          </p>
          <h2 className="text-[12vw] leading-[0.85] nohemi font-black w-full border-b-2 border-zinc-950 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-0">
            <div className="pt-4">
              <span className="reveal-text block tracking-tight leading-[0.76] uppercase">{data.title}</span>
            </div>
            <div className="overflow-hidden text-[4vw] lg:text-[2vw] leading-tight font-medium text-zinc-400 max-w-sm tracking-normal normal-case pb-2">
              <span className="reveal-text block">{data.subtitle}</span>
            </div>
          </h2>
        </div>

        <div className="data-grid w-full flex flex-col lg:flex-row gap-20">
          <div className="w-full lg:w-2/3 flex flex-col border-t border-zinc-200">
            {data.included.map((item, index) => (
              <IncludedRow 
                key={item.id} 
                item={item} 
                index={index} 
                setHoverState={setHoverState}
                onOpen={(it) => setSelectedItem(it)}
              />
            ))}
          </div>

          <div className="w-full lg:w-1/3 flex flex-col">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-400 mb-10 pl-2">✕ Exclusions</h3>
            <div className="flex flex-col gap-8">
              {data.notIncluded.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoverState("excluded")}
                  onMouseLeave={() => setHoverState(null)}
                  className="data-row relative group cursor-none"
                >
                  <div className="relative inline-block">
                    <h4 className="text-2xl md:text-3xl font-regular text-zinc-400 group-hover:text-zinc-950 transition-colors duration-500 normalcase nohemi">
                      {item.title}
                    </h4>
                    <div className="strike-line absolute top-1/2 left-0 w-full h-0.5 bg-zinc-950 -translate-y-1/2 pointer-events-none scale-x-100 origin-left transition-transform duration-500 group-hover:scale-x-0" />
                  </div>
                  <p className="text-sm text-zinc-400 mt-2 max-w-xs group-hover:translate-x-2 transition-transform duration-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

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
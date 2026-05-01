"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import data from "@/data/footer.json";

// Types for better maintainability
interface Season {
  id: string;
  loc: string;
  status: string;
}

interface FooterData {
  brand: string;
  description: string;
  seasons: Season[];
  contact: {
    email: string;
    phone: string;
    site: string;
  };
  tagline: string;
  legal: string;
}

const footerData = data as FooterData;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function InstitutionalFooter() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".footer-item", {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, { scope: containerRef });

  return (
    <footer 
      ref={containerRef} 
      className="w-full bg-zinc-950 text-[#fffef1] pt-32 pb-12 px-6 md:px-12 overflow-hidden border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
          
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="footer-item">
              <h2 className="text-8xl dirtyline font-black tracking-normal mb-8 normal-case">
                {footerData.brand}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                {footerData.description}
              </p>
            </div>
          </div>

          {/* Column 2: Dynamic Season List */}
          <div className="lg:col-span-5">
            <span className="footer-item text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-8 block">
              Event History
            </span>
            <div className="space-y-1">
              {footerData.seasons.map((season, i) => (
                <div 
                  key={i} 
                  className="footer-item group flex items-center justify-between py-4 border-b border-zinc-900 cursor-pointer overflow-hidden"
                >
                  <div className="flex items-baseline gap-8">
                    <span className="text-xs font-mono text-zinc-600 group-hover:text-zinc-200 transition-colors">
                      {season.id}
                    </span>
                    <span className="text-lg font-bold tracking-tight uppercase group-hover:italic transition-all">
                      {season.loc}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    {season.status === "Open" ? "APPLY →" : "LOGGED"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Configurable Connect Info */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <span className="footer-item text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-8 block">
                Connect
              </span>
              <ul className="space-y-4">
                <li className="footer-item group">
                  <a href={`mailto:${footerData.contact.email}`} className="text-sm font-medium flex items-center gap-2 hover:text-zinc-400 transition-colors">
                    {footerData.contact.email} <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
                <li className="footer-item group">
                  <a href={`tel:${footerData.contact.phone}`} className="text-sm font-medium flex items-center gap-2 hover:text-zinc-400 transition-colors">
                    {footerData.contact.phone}
                  </a>
                </li>
                <li className="footer-item group">
                  <a href={`https://${footerData.contact.site}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-zinc-400 transition-colors underline underline-offset-4">
                    {footerData.contact.site}
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-item mt-12 pt-8 border-t border-zinc-900">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest leading-none">
                {footerData.tagline}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-zinc-900 gap-6">
          <span className="text-[10px] font-mono text-zinc-700 tracking-widest">
            {footerData.legal}
          </span>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 group hover:text-zinc-400 transition-colors"
          >
            Back to Top <div className="w-4 h-px bg-white group-hover:w-8 transition-all" />
          </button>
        </div>
      </div>
    </footer>
  );
}
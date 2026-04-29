"use client";

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Sprout, Scale, Trophy, CheckCircle, ArrowRight } from 'lucide-react';

import CardSwap, { Card } from '@/components/ui/CardSwap';

gsap.registerPlugin(ScrollTrigger);

export default function WhoShouldApplyPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pinning logic removed
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative w-full h-screen bg-[#fffef1] text-black selection:bg-[#fffef1] selection:text-[#fffef1] overflow-hidden">
      {/* Split Screen Layout */}
      <div className="relative flex flex-col md:flex-row w-full h-full z-10">
        
        {/* LEFT HALF: Static & Simple */}
        <div className="relative w-full md:w-1/2 h-full flex flex-col justify-center p-12 md:p-24 ">
          <div className="max-w-xl">
            <h1 className="font-dirtyline text-7xl text-black md:text-9xl leading-[0.85] mb-12 tracking-tighter">
              yOuR <br /> JoUrnEY
            </h1>
            
            <p className="text-zinc-400 font-sans font-light text-lg md:text-xl leading-relaxed mb-12">
              We aren&apos;t seeking balance sheets. We seek the optimal <span className="italic text-black">mindset</span> at the definitive stage. Identify your coordinates in the professional spectrum.
            </p>

            <div className="flex items-center gap-6">
                <div className="w-12 h-px bg-zinc-800" />
                <span className="text-[10px] tracking-[0.5em] text-zinc-600 uppercase font-bold">Selective Entry Only</span>
            </div>
          </div>
        </div>

        {/* RIGHT HALF: Card Swap */}
        <div className="relative w-full md:w-1/2 h-full flex items-center justify-center perspective-[2000px] bg-transparent">
          <div style={{ height: '600px', width: '100%', position: 'relative' }}>
            <CardSwap
              width={460}
              height={520}
              cardDistance={60}
              verticalDistance={60}
              delay={5000}
              skewAmount={6}
              easing="elastic" 
              pauseOnHover={true}
            >
              <Card>
                <TraderCardContent
                  icon={<Sprout className="text-emerald-500" size={28} />}
                  level="Phase 01 // SEED"
                  title="BeGiNneR TraDEr"
                  description="A dedicated roadmap to navigate complexity. Learn through structured execution on institutional capital."
                  getPerks={["Personalised Roadmap", "Live 100K Account", "Daily Progress Tracker"]}
                  color="emerald"
                />
              </Card>

              <Card>
                <TraderCardContent
                  icon={<Scale className="text-zinc-400" size={28} />}
                  level="Phase 02 // BALANCE"
                  title="BrEaKEven TraDer"
                  description="Your strategies are sound — your environment is flawed. Predefined routines reduce overtrading."
                  getPerks={["Psychology Reset", "Daily Routine", "Risk Management Audit"]}
                  color="zinc"
                />
              </Card>

              <Card>
                <TraderCardContent
                  icon={<Trophy className="text-amber-500" size={28} />}
                  level="Phase 03 // PEAK"
                  title="ProFitAble TraDEr"
                  description="Detox from standard execution. Connect with peers who operate at your standard and share experience."
                  getPerks={["Premium Retreat", "Mentor Spotlight", "Global Networking"]}
                  color="amber"
                />
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>
    </main>
  );
}

// === Helper Component ===
interface TraderCardContentProps {
  icon: React.ReactNode;
  level: string;
  title: string;
  description: string;
  getPerks: string[];
  color: string;
}

const TraderCardContent: React.FC<TraderCardContentProps> = ({ icon, level, title, description, getPerks, color }) => (
  <div className="relative w-full h-full p-10 flex flex-col justify-between bg-zinc-900 border border-[#fffef1]/10 rounded-3xl group">
    <div className="relative z-10">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-[#fffef1]/5">
        <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-zinc-500 font-bold">{level}</span>
        <div className="w-10 h-10 rounded-full border border-[#fffef1]/5 bg-black flex items-center justify-center">
          {icon}
        </div>
      </header>
      
      <h3 className="font-dirtyline text-5xl leading-[0.9] mb-6 text-[#fffef1] uppercase">
        {title}
      </h3>
      
      <p className="text-zinc-400 font-sans font-light text-base leading-relaxed mb-8">
        {description}
      </p>

      <div className="space-y-3">
        {getPerks.map((perk, i) => (
          <div key={i} className="flex items-center gap-3">
            <CheckCircle size={14} className={`text-${color}-500 opacity-70`} />
            <span className="text-sm font-medium text-zinc-300">{perk}</span>
          </div>
        ))}
      </div>
    </div>

    <footer className="mt-8 pt-6 border-t border-[#fffef1]/5 relative z-20">
       <button 
         type="button"
         onClick={(e) => {
           e.stopPropagation(); 
           console.log("Action triggered for:", title);
         }}
         className="flex w-full items-center justify-between pb-2 py-4 px-6 rounded-xl bg-[#fffef1] text-black font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-zinc-800 hover:text-[#fffef1] transition-colors cursor-pointer pointer-events-auto"
       >
          Book My Spot
          <ArrowRight size={16} className="-rotate-45" />
       </button>
    </footer>
  </div>
);
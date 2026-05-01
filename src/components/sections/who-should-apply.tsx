"use client";

import React from 'react';
import { Sprout, Scale, Trophy, CheckCircle, ArrowRight } from 'lucide-react';
import CardSwap, { Card } from '@/components/ui/CardSwap';

export default function WhoShouldApplyPage() {
  return (
    <main className="relative mt-40 w-full min-h-screen bg-[#fffef1] text-black selection:bg-black selection:text-[#fffef1] overflow-hidden">
      
      {/* Split Layout */}
      <div className="relative flex flex-col md:flex-row w-full min-h-screen z-10">
        
        {/* LEFT */}
        <div className="relative w-full md:w-1/2 flex flex-col justify-center px-6 md:px-24 py-20">
          <div className="max-w-xl">
            <h1 className="font-dirtyline text-6xl md:text-9xl leading-[0.85] mb-12 tracking-tighter">
              yOuR <br /> JoUrnEY
            </h1>
            
            <p className="text-zinc-400 font-light text-base md:text-xl leading-relaxed mb-12">
              We aren&apos;t seeking balance sheets. We seek the optimal{" "}
              <span className="italic text-black">mindset</span> at the definitive stage.
              Identify your coordinates in the professional spectrum.
            </p>

            <div className="flex items-center gap-6">
              <div className="w-12 h-px bg-zinc-800" />
              <span className="text-[10px] tracking-[0.5em] text-zinc-600 uppercase font-bold">
                Selective Entry Only
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center perspective-[2000px] px-4 md:px-0 py-20 md:pt-50">
          <div className="w-full max-w-115 min-h-fit h-130 relative">
            <CardSwap
              width={460}
              height={520}
              cardDistance={60}
              verticalDistance={60}
              delay={5000}
              skewAmount={6}
              easing="elastic"
              pauseOnHover
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

// ============================
// Helper Component
// ============================

interface TraderCardContentProps {
  icon: React.ReactNode;
  level: string;
  title: string;
  description: string;
  getPerks: string[];
  color: 'emerald' | 'zinc' | 'amber';
}

// ✅ FIX: Tailwind-safe color mapping (no dynamic class bug)
const colorMap = {
  emerald: 'text-emerald-500',
  zinc: 'text-zinc-400',
  amber: 'text-amber-500',
};

const TraderCardContent: React.FC<TraderCardContentProps> = ({
  icon,
  level,
  title,
  description,
  getPerks,
  color,
}) => (
  <div className="relative w-full h-full p-10 flex flex-col justify-between bg-zinc-900 border border-[#fffef1]/10 rounded-3xl group">
    
    <div>
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-[#fffef1]/5">
        <span className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 font-bold">
          {level}
        </span>
        <div className="w-10 h-10 rounded-full border border-[#fffef1]/5 bg-black flex items-center justify-center">
          {icon}
        </div>
      </header>
      
      <h3 className="font-dirtyline text-5xl leading-[0.9] mb-6 text-[#fffef1] uppercase">
        {title}
      </h3>
      
      <p className="text-zinc-400 font-light text-base leading-relaxed mb-8">
        {description}
      </p>

      <div className="space-y-3">
        {getPerks.map((perk, i) => (
          <div key={i} className="flex items-center gap-3">
            <CheckCircle size={14} className={`${colorMap[color]} opacity-70`} />
            <span className="text-sm font-medium text-zinc-300">{perk}</span>
          </div>
        ))}
      </div>
    </div>

    <button
      type="button"
      className="mt-8 flex w-full items-center justify-between py-4 px-6 rounded-xl bg-[#fffef1] text-black font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-zinc-800 hover:text-[#fffef1] transition-colors"
    >
      Book My Spot
      <ArrowRight size={16} className="-rotate-45" />
    </button>
  </div>
);
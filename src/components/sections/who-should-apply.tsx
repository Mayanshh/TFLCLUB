"use client";

import React from "react";

import {
  ArrowRight,
  CheckCircle,
  Scale,
  Sprout,
  Trophy,
} from "lucide-react";

import CardSwap, { Card } from "@/components/ui/CardSwap";

import whoShouldApplyData from "@/data/who-should-apply.json";

type ColorType = "emerald" | "zinc" | "amber";

interface TraderData {
  level: string;
  title: string;
  description: string;
  perks: string[];
  color: ColorType;
  icon: "Sprout" | "Scale" | "Trophy";
}

const iconMap = {
  Sprout: <Sprout className="text-emerald-500" size={28} />,
  Scale: <Scale className="text-zinc-400" size={28} />,
  Trophy: <Trophy className="text-amber-500" size={28} />,
};

export default function WhoShouldApplyPage() {
  const cards = whoShouldApplyData as TraderData[];

  return (
    <main className="relative mt-40 min-h-screen w-full overflow-hidden bg-[#fffef1] text-black selection:bg-black selection:text-[#fffef1]">
      {/* Split Layout */}
      <div className="relative z-10 flex min-h-screen w-full flex-col md:flex-row">
        {/* LEFT */}
        <div className="relative flex w-full flex-col justify-center px-6 py-20 md:w-1/2 md:px-24">
          <div className="max-w-xl">
            <h1 className="dirtyline uppercase mb-12 text-6xl leading-[0.85] tracking-tighter md:text-9xl">
              yOuR <br /> JoUrnEY
            </h1>

            <p className="mb-12 text-base font-light leading-relaxed text-zinc-400 md:text-xl">
              We aren&apos;t seeking balance sheets. We seek the optimal{" "}
              <span className="italic text-black">mindset</span> at the
              definitive stage. Identify your coordinates in the professional
              spectrum.
            </p>

            <div className="flex items-center gap-6">
              <div className="h-px w-12 bg-zinc-800" />

              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-600">
                Selective Entry Only
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex w-full items-center justify-center px-4 py-24 md:w-1/2 md:px-0 md:pt-50">
          <div className="relative h-130 w-full max-w-115">
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
              {cards.map((card, index) => (
                <Card key={index}>
                  <TraderCardContent
                    icon={iconMap[card.icon]}
                    level={card.level}
                    title={card.title}
                    description={card.description}
                    getPerks={card.perks}
                    color={card.color}
                  />
                </Card>
              ))}
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
  color: ColorType;
}

const colorMap = {
  emerald: "text-emerald-500",
  zinc: "text-zinc-400",
  amber: "text-amber-500",
};

const TraderCardContent: React.FC<TraderCardContentProps> = ({
  icon,
  level,
  title,
  description,
  getPerks,
  color,
}) => (
  <div className="relative flex h-full w-full flex-col justify-between rounded-3xl border border-[#fffef1]/10 bg-zinc-900 p-10">
    <div>
      <header className="mb-8 flex items-center justify-between border-b border-[#fffef1]/5 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
          {level}
        </span>

        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#fffef1]/5 bg-black">
          {icon}
        </div>
      </header>

      <h3 className="dirtyline mb-6 text-5xl normalcase leading-[0.9] text-[#fffef1]">
        {title}
      </h3>

      <p className="mb-8 text-base font-light leading-relaxed text-zinc-400">
        {description}
      </p>

      <div className="space-y-3">
        {getPerks.map((perk, i) => (
          <div key={i} className="flex items-center gap-3">
            <CheckCircle
              size={14}
              className={`${colorMap[color]} opacity-70`}
            />

            <span className="text-sm font-medium text-zinc-300">
              {perk}
            </span>
          </div>
        ))}
      </div>
    </div>

    <button
      type="button"
      className="mt-8 flex w-full items-center justify-between rounded-xl bg-[#fffef1] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-zinc-800 hover:text-[#fffef1]"
    >
      Book My Spot

      <ArrowRight size={16} className="-rotate-45" />
    </button>
  </div>
);
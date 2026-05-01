"use client";

import React from "react";
import { Zap } from "lucide-react";
import Button from "@/components/ui/Button";

// -----------------------------
// TYPES (STRICT + BACKEND READY)
// -----------------------------
export interface EventItem {
  status: string;
  season: string | number;
  location: string;
  perk: string;
  price: string;
}

interface CardProps {
  item: EventItem;
  isPast?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// -----------------------------
// COMPONENT
// -----------------------------
export default function EventCard({
  item,
  isPast = false,
  className = "",
  style,
}: CardProps) {
  return (
    <article
      style={style}
      className={`
        w-full max-w-120
        bg-zinc-800 text-[#fffef1]
        rounded-[2.5rem]
        p-6 sm:p-8 md:p-12
        shadow-xl border border-zinc-200
        flex flex-col justify-between
        transform-gpu
        ${className}
      `}
    >
      {/* -----------------------------
          HEADER
      ----------------------------- */}
      <header className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-3">

          {/* Status */}
          <span
            className={`
              w-fit px-3 py-1 rounded-full
              text-[9px] font-bold tracking-[0.2em] uppercase border
              ${
                isPast
                  ? "bg-zinc-50 text-zinc-400 border-zinc-100"
                  : "bg-zinc-100 text-zinc-500 border-zinc-200"
              }
            `}
          >
            {item.status}
          </span>

          {/* Title */}
          <h3
            className="
              dirtyline leading-none
              text-[clamp(2.2rem,5vw,3rem)]
            "
          >
            sEAsOn <span className="nohemi">{item.season}</span>
          </h3>

          {/* Location */}
          <p className="text-base sm:text-lg md:text-xl font-medium tracking-tight text-zinc-400">
            {item.location}
          </p>
        </div>

        {/* Icon */}
        <div
          className={`
            h-10 w-10 sm:h-12 sm:w-12
            rounded-full flex items-center justify-center shrink-0
            ${isPast ? "bg-zinc-200" : "bg-[#fffef1]"}
          `}
        >
          <Zap
            className={isPast ? "text-zinc-400" : "text-black"}
            size={18}
            fill="currentColor"
          />
        </div>
      </header>

      {/* -----------------------------
          BENEFIT
      ----------------------------- */}
      <section className="my-6 sm:my-8">
        <p className="text-zinc-400 text-[9px] uppercase tracking-[0.3em] font-bold mb-2">
          Benefit
        </p>

        <p className="text-base sm:text-lg md:text-xl leading-snug font-semibold">
          {item.perk}
        </p>
      </section>

      {/* -----------------------------
          FOOTER
      ----------------------------- */}
      <footer className="pt-5 sm:pt-6 border-t border-zinc-100 flex items-center justify-between gap-4">
        
        {/* Price */}
        <div>
          <p className="text-xl sm:text-2xl font-black font-sans">
            {item.price}
          </p>
          <p className="text-[10px] uppercase text-zinc-400">
            Entry Fee
          </p>
        </div>

        {/* CTA */}
        {!isPast && (
          <Button
            variant="solid"
            size="md"
            showArrow
            className="bg-[#fffef1] text-black px-4 md:w-30 sm:px-6 min-w-22.5"
          >
            Join
          </Button>
        )}
      </footer>
    </article>
  );
}
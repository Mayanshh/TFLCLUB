"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Trophy, ShieldCheck, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const prizes = [
  {
    rank: "02",
    place: "2nd Place",
    amount: "$200",
    account: "50K 1-Step Eval",
    description:
      "Second position secures a mid-tier capital allocation with strong upside potential.",
  },
  {
    rank: "01",
    place: "1st Place",
    amount: "$400",
    account: "100K 1-Step Eval",
    description:
      "Top performers unlock the highest funding tier with maximum capital exposure.",
  },
  {
    rank: "03",
    place: "3rd Place",
    amount: "$125",
    account: "25K 1-Step Eval",
    description:
      "A strong finish still earns access to entry-level capital and progression.",
  },
];

export default function Rewards() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      // Initial state (hidden bottom-right)
      gsap.set(cards, {
        x: 300,
        y: 300,
        opacity: 0,
        scale: 0.9,
        rotate: 4,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3200",
          scrub: true,
          pin: true,
        },
      });

      cards.forEach((card, i) => {
        // Card entry (stacking diagonally)
        tl.to(
          card,
          {
            x: -i * 60,
            y: -i * 60,
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 1,
            ease: "power3.out",
          },
          i * 1
        );

        // Counter update
        tl.to(
          counterRef.current,
          {
            innerText: prizes[i].rank,
            duration: 0.2,
          },
          i * 1
        );

        // Text transition
        tl.to(
          textRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.25,
          },
          i * 1
        ).to(
          textRef.current,
          {
            innerText: prizes[i].description,
            opacity: 1,
            y: 0,
            duration: 0.4,
          },
          i * 1 + 0.25
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#0b1d3a] overflow-hidden flex items-center justify-center"
    >
      {/* COUNTER */}
      <div className="absolute bottom-10 left-10 text-[120px] text-[#e8e2c6] font-light leading-none">
        <span ref={counterRef}>01</span>
      </div>

      {/* RIGHT TEXT */}
      <div className="absolute right-20 max-w-[320px] text-white text-sm leading-relaxed">
        <p ref={textRef}>{prizes[0].description}</p>
      </div>

      {/* CARD STACK */}
      <div className="relative w-105 h-130">
        {prizes.map((prize, i) => (
          <div
            key={i}
            ref={(el) => {
              cardsRef.current[i] = el; // ✅ FIXED (no return)
            }}
            className="absolute top-0 left-0 w-full h-full rounded-4xl bg-white/90 backdrop-blur-xl p-8 flex flex-col justify-between shadow-2xl border border-white/20 will-change-transform"
          >
            {/* TOP */}
            <div className="flex justify-between">
              <span className="text-5xl opacity-20 font-black">
                {prize.rank}
              </span>
              <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                <Trophy size={18} />
              </div>
            </div>

            {/* MIDDLE */}
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-zinc-500 mb-2">
                {prize.place}
              </p>

              <h3 className="text-5xl font-mono text-black mb-4">
                {prize.amount}
              </h3>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 w-fit">
                <ShieldCheck size={14} />
                <span className="text-xs uppercase tracking-widest">
                  {prize.account}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-between items-center pt-6 border-t">
              <span className="text-xs uppercase tracking-widest text-zinc-500">
                Claim
              </span>

              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
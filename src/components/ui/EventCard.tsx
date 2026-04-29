"use client";

import React from 'react';
import { Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CardProps {
  item: any;
  isPast?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function EventCard({ item, isPast, className, style }: CardProps) {
  return (
    <div 
      style={style}
      className={`w-full max-w-120 bg-zinc-800 text-[#fffef1] rounded-[2.5rem] p-8 md:p-12 shadow-xl flex flex-col justify-between border border-zinc-200 transform-gpu ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-3">
          <span className={`w-fit px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase border ${isPast ? 'bg-zinc-50 text-zinc-400 border-zinc-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
            {item.status}
          </span>
          <h3 className="dirtyline text-5xl leading-none">sEAsOn <span className='nohemi'>{item.season}</span></h3>
          <p className="text-xl font-medium tracking-tight text-zinc-400">{item.location}</p>
        </div>
        <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${isPast ? 'bg-zinc-200' : 'bg-[#fffef1]'}`}>
          < Zap className={`${isPast ? 'text-zinc-400' : 'text-black'}`} size={20} fill="currentColor" />
        </div>
      </div>

      <div className="my-8">
        <p className="text-zinc-400 text-[9px] uppercase tracking-[0.3em] font-bold mb-2">Benefit</p>
        <p className="text-lg md:text-xl leading-snug font-semibold">{item.perk}</p>
      </div>

      <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
        <div>
          <p className="text-2xl font-black font-sans">{item.price}</p>
          <p className="text-[10px] uppercase text-zinc-400">Entry Fee</p>
        </div>
        {!isPast && (
          <Button variant="solid" size="md" showArrow className="bg-[#fffef1] w-25 text-black px-6">
            Join
          </Button>
        )}
      </div>
    </div>
  );
}
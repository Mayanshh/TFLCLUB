import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import SmoothScroll from "@/providers/SmoothScroll";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const nohemi = localFont({
  src: [
    { 
      path: "../../public/fonts/Nohemi-Light.woff2", 
      weight: "300", 
      style: "normal" 
    },
    { 
      path: "../../public/fonts/Nohemi-Regular.woff2", 
      weight: "400", 
      style: "normal" 
    },
    { 
      path: "../../public/fonts/Nohemi-SemiBold.woff2", 
      weight: "600", 
      style: "normal" 
    },
    { 
      path: "../../public/fonts/Nohemi-Black.woff2", 
      weight: "900", 
      style: "normal" 
    },
  ],
  variable: "--font-nohemi",
  display: "swap",
});

const dirtyline = localFont({
  src: "../../public/fonts/dirtyline.woff2",
  variable: "--font-dirtyline",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TFL CLUB",
  description: "5 days. Live trading. Profitable mentors. Real funding opportunities. Build discipline, network, and strategy in one immersive experience.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("selection:bg-zinc-900 selection:text-[#fffef1]", "font-sans", geist.variable)}>
      <body
        className={`${nohemi.variable} ${dirtyline.variable} font-sans antialiased bg-[#fffef1] text-black`}
      >
        <SmoothScroll>
          <main className="relative min-h-screen">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}
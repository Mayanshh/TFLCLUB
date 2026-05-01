import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import AppWrapper from "@/components/ui/AppWrapper";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const nohemi = localFont({
  src: [
    { path: "../../public/fonts/Nohemi-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/Nohemi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Nohemi-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Nohemi-Black.woff2", weight: "900", style: "normal" },
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
  metadataBase: new URL('https://tflclub.vercel.app/'),
  title: {
    default: "TFL CLUB | Elite Trading Bootcamp",
    template: "%s | TFL CLUB",
  },
  description: "5 days. Live trading. Profitable mentors. Real funding opportunities. Build discipline, network, and strategy in one immersive experience.",
  keywords: ["Trading Bootcamp", "Prop Firm Funding", "Live Trading", "Financial Discipline", "TFL Club", "Trading Mentorship"],
  authors: [{ name: "TFL CLUB" }],
  creator: "TFL CLUB",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tflclub.vercel.app/",
    siteName: "TFL CLUB",
    title: "TFL CLUB | Elite Trading Bootcamp",
    description: "Join the definitive stage of your trading journey. Live execution, institutional capital, and an elite network.",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "TFL CLUB" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TFL CLUB | Elite Trading Bootcamp",
    description: "5 days. Live trading. Real funding. Identify your coordinates in the professional spectrum.",
    images: ["/images/og-image.png"],
    creator: "@tflclub",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#fffef1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={cn(
        "selection:bg-zinc-900 selection:text-[#fffef1]", 
        geist.variable,
        nohemi.variable,
        dirtyline.variable
      )}
    >
      <body className="font-sans antialiased bg-[#fffef1] text-black">
        {/* Pass the children into our Client Wrapper */}
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
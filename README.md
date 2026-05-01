This is a comprehensive, professional README.md tailored for your TFL CLUB project. It is structured to act as both a technical manual for developers and a roadmap for backend integration.

🏆 TFL CLUB | Institutional Grade Trading Experience
TFL CLUB is a high-performance, visually immersive web platform built for an elite trading bootcamp. It combines cutting-edge frontend technologies with "Awwwards-level" aesthetics to provide a premium experience for traders seeking professional funding and mentorship.

🚀 Tech Stack
Framework: Next.js 15+ (App Router)

Styling: Tailwind CSS v4 (using OKLCH color space & @theme variables)

Animations: GSAP (GreenSock) & ScrollTrigger

Smooth Scrolling: Lenis

Language: TypeScript

Fonts: Custom typography via next/font/local (Nohemi & Dirtyline)

📂 Project Architecture
The codebase follows a modular, feature-based structure designed for scalability and clear separation of concerns.

Core Directory Breakdown

src/app: Contains the global layout, metadata configuration, and the main entry point (page.tsx).

src/components/effects: High-level visual wrappers (Parallax, Text Reveals, Stacked transitions) that enhance the UX.

src/components/sections: The building blocks of the page (Hero, Mentors, FAQ, Hall of Fame). Each file represents a semantic section of the site.

src/components/ui: Atomic components and core systems like the Preloader, Navbar, and custom Button.

src/data: Centralized JSON storage. This acts as the "Source of Truth" for all content, making it easy to transition to a headless CMS or API later.

src/providers: Context providers, specifically the SmoothScroll (Lenis) initialization.

🛠️ Developer Workflow
Installation
Clone & Install:

Bash
git clone https://github.com/Mayanshh/TFLCLUB.git
npm install
Environment Setup: Create a .env.local for future API keys (e.g., Sanity, Stripe).


Run Development:

Bash
npm run dev

Working with Typography
The project uses custom fonts configured in layout.tsx. To use them in CSS:

Body Text: Defaults to Nohemi.

Headlines: Use the utility class .font-dirtyline or .dirtyline.

Handling Assets
Images: Use .avif or .webp in the public/images folder for maximum performance.

Videos: Hero background videos are stored in public/videos. Ensure they stay under 5MB for fast initial LCP (Largest Contentful Paint).

🔌 Backend Integration Guide
For backend developers looking to integrate a CMS (Sanity/Strapi) or a custom Node.js/Python API, the frontend is already "API-Ready."

1. Data Mapping
Currently, all data is fetched from the src/data/*.json files. To integrate your backend:

Identify the JSON structure in src/data/mentors.json (or others).

Create an equivalent API endpoint that returns the same schema.

Update the page.tsx or the specific section to fetch from your URL.

2. Implementation Example
Current Static Version:

TypeScript
import mentorsData from "@/data/mentors.json";
// ... map over mentorsData
Proposed Dynamic Version:

TypeScript
// src/app/page.tsx (Server Component)
async function getMentors() {
  const res = await fetch('https://api.tflclub.com/v1/mentors', { next: { revalidate: 3600 } });
  return res.json();
}

export default async function Page() {
  const mentors = await getMentors();
  return <Mentors data="{mentors}"/>;
}
3. Key Endpoints Needed
GET /api/mentors: List of mentors with profile images and descriptions.

GET /api/events: Upcoming bootcamp dates and details.

POST /api/apply: For the "Who Should Apply" or registration forms.

✨ Animation & UX Standards
The Preloader
The site uses a synchronized GSAP preloader (Preloader.tsx). It calculates a loading percentage and then triggers a clip-path curtain reveal.

Note: If adding heavy assets, ensure the onComplete callback in AppWrapper.tsx is only fired after window.onload.

Smooth Scroll (Lenis)
Global scrolling is hijacked by Lenis to provide a "fluid" feel. If you create a component that uses position: fixed, ensure it is placed outside the <SmoothScroll> wrapper if it needs to remain static relative to the viewport.

ScrollTrigger Safety
Always wrap GSAP animations in the useGSAP hook or ensure ScrollTrigger.refresh() is called if the page height changes dynamically (e.g., expanding an FAQ).

🚀 Deployment
The project is optimized for Vercel.

Push your changes to GitHub.

Import the project into the Vercel Dashboard.

The next.config.ts handles the build optimizations automatically.

© 2026 TFL CLUB | Built for the 1% of Traders.
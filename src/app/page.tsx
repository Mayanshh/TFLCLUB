import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Events from "@/components/sections/Events";
import WhoShouldApply from "@/components/sections/who-should-apply";
import Rewards from "@/components/sections/Rewards";

export default function Home() {
  return (
    <main className="relative flex flex-col h-full min-h-screen bg-[#fffef1]">
      <Hero />
      <About />
      <Events />
      <WhoShouldApply />
      <Rewards />
      <div className="h-[200svh] w-full bg-amber-200"></div>
    </main>
  );
}
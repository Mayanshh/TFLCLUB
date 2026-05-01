import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Events from "@/components/sections/Events";
import WhoShouldApply from "@/components/sections/who-should-apply";
import Rewards from "@/components/sections/Rewards";
import HallOfFame from "@/components/sections/HallOfFame";
import MentorsSection from "@/components/sections/Mentors";
import WhatsIncluded from "@/components/sections/WhatsIncluded";
import Partners from "@/components/sections/Partners";

export default function Home() {
  return (
    <main className="relative flex flex-col h-full min-h-screen bg-[#fffef1]">
      <Hero />
      <About />
      <Events />      
      <Rewards />
      <div id="rewards_scrollable_area" className="h-[400svh] w-full bg-[#fffef1]"></div>
      <WhoShouldApply />
      <HallOfFame />
      <MentorsSection />
      <WhatsIncluded />
      <Partners />
    </main>
  );
}
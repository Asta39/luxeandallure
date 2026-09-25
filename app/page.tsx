import NavbarSectionTwo from "@/components/ui/navbar-section-2";
import { Hero } from "@/components/sections/Hero";
import { ScrollSequence } from "@/components/sections/ScrollSequence";

export default function Home() {
  return (
    <div className="w-full">
      <NavbarSectionTwo overlay>
        <ScrollSequence />
        <Hero />
      </NavbarSectionTwo>
    </div>
  );
}

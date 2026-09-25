import NavbarSectionTwo from "@/components/ui/navbar-section-2";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <div className="w-full">
      <NavbarSectionTwo>
        <Hero />
      </NavbarSectionTwo>
    </div>
  );
}

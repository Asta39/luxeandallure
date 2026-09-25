import { StickerCanvas } from "@/components/sections/StickerCanvas";

// The headline lives inside the canvas as the page <h1> (server-rendered HTML; the stickers hydrate after).
export function Hero() {
  return (
    <section aria-label="Luxe & Allure Events" className="relative z-10 mt-6 w-full max-w-[1400px] pb-4">
      <StickerCanvas />
    </section>
  );
}

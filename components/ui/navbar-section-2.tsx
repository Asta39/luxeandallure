"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";


type NavItem = {
  label: string;
  href?: string;
  panelId?: "services" | "experiences" | "packages";
};

type ProductCard = {
  title: string;
  description?: string;
  href?: string;
  mediaType?: "component" | "image";
  imageSrc?: string;
  component?: ReactNode;
  thumb?: string;
};

type MenuPanel = {
  id: NonNullable<NavItem["panelId"]>;
  items: ProductCard[];
};

const navItems: NavItem[] = [
  { label: "Services", panelId: "services" },
  { label: "Experiences", panelId: "experiences" },
  { label: "Gallery", href: "#" },
  { label: "About", href: "#" },
  { label: "Packages", panelId: "packages" },
  { label: "Testimonials", href: "#" },
];

const menuPanels: MenuPanel[] = [
  {
    id: "services",
    items: [
      { title: "Weddings", mediaType: "image", imageSrc: "/stickers/ring.webp" },
      { title: "Corporate", mediaType: "image", imageSrc: "/stickers/mic.webp" },
      { title: "Milestones", description: "Birthdays, showers and life's big moments, styled.", thumb: "/stickers/popper.webp" },
      { title: "Event Hire", description: "Tent, table and chair hire for any venue.", thumb: "/stickers/tent.webp" },
    ],
  },
  {
    id: "experiences",
    items: [
      { title: "Garden Weddings", description: "Tented garden celebrations with bespoke décor, styling and full-service setup.", thumb: "/stickers/bouquet.webp" },
      { title: "Bridal & Baby Showers", description: "Soft, elegant themes for the celebrations that come before the big day.", thumb: "/stickers/balloons.webp" },
      { title: "VIP & Private", description: "Discreet, high-touch event design for private hosts and high-profile guests.", thumb: "/stickers/crown.webp" },
    ],
  },
  {
    id: "packages",
    items: [
      { title: "Intimate", description: "Refined styling for smaller gatherings, with the essentials done beautifully.", thumb: "/stickers/candle.webp" },
      { title: "Signature", description: "Our full décor and planning service, tailored to your venue and guest list.", thumb: "/stickers/flutes.webp" },
      { title: "Grand", description: "Large-scale productions with custom builds, tent hire and on-site coordination.", thumb: "/stickers/chandelier.webp" },
    ],
  },
];

function getPanel(panelId: string | null) {
  return menuPanels.find((panel) => panel.id === panelId);
}

function LuxeLogo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <Image
      src={light ? "/brand/logo-white.png" : "/brand/logo.png"}
      alt="Luxe & Allure Events and Decor"
      width={1400}
      height={432}
      priority
      className={`h-10 w-auto lg:h-12 ${className}`}
    />
  );
}

function PanelCard({ item, compact = false }: { item: ProductCard; compact?: boolean }) {
  if (item.component || item.imageSrc) {
    return (
      <a href={item.href ?? "#"} className="group relative flex h-[180px] flex-col gap-1.5 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/60 p-2 transition-all duration-300 hover:border-white/20 hover:bg-neutral-900">
        <div className="relative z-10 min-h-0 flex-1 overflow-hidden rounded-lg bg-[radial-gradient(circle_at_50%_45%,rgba(182,40,44,0.30),transparent_68%)]">
          {item.mediaType === "image" && item.imageSrc ? (
            <Image src={item.imageSrc} alt="" fill sizes="220px" className="object-contain p-3 drop-shadow-[0_10px_14px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out group-hover:-rotate-3 group-hover:scale-110" />
          ) : item.component}
        </div>
        <span className="relative z-10 block text-center text-xs font-medium text-neutral-300 transition-colors group-hover:text-white">{item.title}</span>
      </a>
    );
  }

  return (
    <a href={item.href ?? "#"} className={compact ? "group relative flex h-[86px] flex-col justify-center overflow-hidden rounded-xl border border-white/10 bg-neutral-900/60 p-3 transition-all hover:border-white/20 hover:bg-neutral-900" : "group relative flex h-[180px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-neutral-900/60 p-4 transition-all hover:border-white/20 hover:bg-neutral-900"}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(182,40,44,0.14),transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />
      {compact && item.thumb && (
        <Image src={item.thumb} alt="" width={120} height={120} className="absolute right-3 top-1/2 size-14 -translate-y-1/2 object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110" />
      )}
      {!compact && (
        <div className="relative z-10 flex items-start justify-between">
          {item.thumb && <Image src={item.thumb} alt="" width={160} height={160} className="size-16 object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110" />}
          <ArrowUpRight className="size-4 text-neutral-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
        </div>
      )}
      <div className="relative z-10">
        <h4 className={compact ? "text-sm font-medium text-white" : "text-base font-medium text-white"}>{item.title}</h4>
        <p className={compact ? "mt-1 max-w-[62%] text-[11px] leading-4 text-neutral-400 transition-colors group-hover:text-neutral-300" : "mt-1 text-[11px] leading-4 text-neutral-400 transition-colors group-hover:text-neutral-300"}>{item.description}</p>
      </div>
    </a>
  );
}

function DropdownPanel({ panel }: { panel: MenuPanel }) {
  if (panel.id === "services") {
    const [weddings, corporate, milestones, hire] = panel.items;
    return (
      <div className="grid grid-cols-[1.2fr_1.2fr_1fr] gap-4 bg-neutral-800 p-4">
        <PanelCard item={weddings} />
        <PanelCard item={corporate} />
        <div className="flex flex-col gap-2"><PanelCard item={milestones} compact /><PanelCard item={hire} compact /></div>
      </div>
    );
  }

  return <div className="grid grid-cols-3 gap-4 bg-neutral-800 p-4">{panel.items.map((item) => <PanelCard key={item.title} item={item} />)}</div>;
}

/** `overlay` floats the header over a full-screen first section (white logo, glass controls). */
export default function NavbarTwo({ children, overlay = false }: { children?: ReactNode; overlay?: boolean }) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileActiveMenu, setMobileActiveMenu] = useState<string | null>(null);
  const activePanel = getPanel(activeMenu);
  const notchRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Close whichever menu is open on outside tap/click or Escape.
  useEffect(() => {
    if (!activeMenu && !mobileOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (activeMenu && !notchRef.current?.contains(target)) setActiveMenu(null);
      if (mobileOpen && !mobileRef.current?.contains(target)) {
        setMobileOpen(false);
        setMobileActiveMenu(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setActiveMenu(null);
      setMobileOpen(false);
      setMobileActiveMenu(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMenu, mobileOpen]);

  const toggleMenu = (menuName: string) => setActiveMenu(activeMenu === menuName ? null : menuName);

  return (
    <div className="relative flex min-h-[720px] w-full select-none flex-col items-center overflow-clip bg-background px-6 pb-6 pt-0 font-sans text-zinc-900 transition-colors duration-300">
      <div className={overlay ? "absolute inset-x-0 top-0 z-40 flex flex-col items-center px-6" : "contents"}>
      <div className="relative z-30 hidden h-12 w-full max-w-7xl items-center justify-between lg:flex">
        <a href="#" className="flex items-center text-brand-900"><LuxeLogo light={overlay} /></a>

        <div ref={notchRef} className="absolute left-1/2 top-0 hidden w-[700px] -translate-x-1/2 lg:block" style={{ filter: "drop-shadow(0 12px 20px rgba(0, 0, 0, 0.18))" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute -left-[18px] top-0 z-10 text-neutral-800"><path d="M 20 20 L 20 0 L 0 0 C 11.046 0 20 11.046 20 20 Z" fill="currentColor" /></svg>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute -right-[18px] top-0 z-10 text-neutral-800"><path d="M 0 0 L 20 0 C 8.954 0 0 8.954 0 20 Z" fill="currentColor" /></svg>

          <motion.div animate={{ height: activePanel ? 260 : 48 }} transition={{ type: "spring", stiffness: 300, damping: 28 }} className="relative flex w-full flex-col justify-start overflow-hidden bg-neutral-800" style={{ borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
            <div className="z-20 flex h-12 items-center justify-center px-6">
              <nav className="flex w-full items-center justify-center gap-5 text-xs font-medium text-neutral-300">
                {navItems.map((item) => item.panelId ? (
                  <button key={item.label} onClick={() => toggleMenu(item.panelId!)} className={`flex cursor-pointer items-center gap-1 rounded-md px-3 py-1 outline-none transition-all hover:text-white ${activeMenu === item.panelId ? "bg-neutral-900 text-white" : "text-neutral-300"}`}>
                    {item.label}<ChevronDown className={`h-3.5 w-3.5 opacity-70 transition-transform duration-300 ${activeMenu === item.panelId ? "rotate-180" : ""}`} />
                  </button>
                ) : <a key={item.label} href={item.href} className="px-2 py-1 text-neutral-300 transition-colors duration-250 hover:text-white">{item.label}</a>)}
              </nav>
            </div>

            <AnimatePresence mode="wait">
              {activePanel && (
                <motion.div key={activePanel.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="overflow-hidden border-t border-white/10 bg-neutral-800">
                  <DropdownPanel panel={activePanel} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <a href="#" className="group flex items-center gap-1 rounded-lg bg-primary px-3.5 py-1.5 text-[12px] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover">Build Your Event<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></a>
      </div>

      <div ref={mobileRef} className="relative z-30 w-full lg:hidden">
      <div className="flex h-14 w-full items-center justify-between">
        <a href="#" className="text-brand-900"><LuxeLogo light={overlay} /></a>
        <div className="flex items-center gap-2">
          <a href="#" className="group flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm">Build Your Event<ArrowRight className="h-3 w-3" /></a>
          <button onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} className={`grid size-9 place-items-center rounded-lg border ${overlay ? "border-white/30 bg-white/15 text-white backdrop-blur-md" : "border-zinc-200 text-zinc-900"}`}>{mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}</button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="absolute inset-x-0 top-full z-40 overflow-hidden rounded-xl bg-neutral-800 text-white shadow-2xl">
            <div className="grid max-h-[calc(100dvh-5rem)] gap-1 overflow-y-auto p-4">
              {navItems.map((item) => {
                const panel = item.panelId ? getPanel(item.panelId) : null;
                const isOpen = mobileActiveMenu === item.panelId;

                if (!item.panelId) {
                  return <a key={item.label} href={item.href || "#"} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-neutral-200 hover:bg-white/10 hover:text-white">{item.label}</a>;
                }

                return (
                  <div key={item.label}>
                    <button type="button" onClick={() => setMobileActiveMenu(isOpen ? null : item.panelId!)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-neutral-200 hover:bg-white/10 hover:text-white">
                      {item.label}
                      <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && panel && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="mx-3 mb-2 grid gap-2 border-l border-white/10 pl-3 pt-1">
                            {panel.items.map((panelItem) => (
                              <a key={panelItem.title} href={panelItem.href ?? "#"} className="rounded-md px-3 py-2 hover:bg-white/5">
                                <span className="block text-sm font-medium text-white">{panelItem.title}</span>
                                {panelItem.description && <span className="mt-0.5 block text-xs leading-5 text-neutral-400">{panelItem.description}</span>}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      </div>

      {children}
    </div>
  );
}

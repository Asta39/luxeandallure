"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { ChevronDown } from "lucide-react";
import { FRAME_COUNT, activeAt, chapters, frameAt, frameSrc } from "@/data/sequence";

const ASPECT = 16 / 9;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Cover-fit a 16:9 frame into cw×ch. On narrow screens it pans toward (panX, panY) so the
 * featured detail stays in view, then zooms by `zoom` around that same point.
 */
function coverBox(cw: number, ch: number, panX: number, panY: number, zoom: number) {
  const bw = Math.max(cw, ch * ASPECT);
  const bh = bw / ASPECT;
  const bx = clamp(cw / 2 - (bw * panX) / 100, cw - bw, 0);
  const by = (ch - bh) / 2;
  const fx = bx + (bw * panX) / 100;
  const fy = by + (bh * panY) / 100;
  const dw = bw * zoom;
  const dh = dw / ASPECT;
  return {
    dw,
    dh,
    dx: clamp(fx - (dw * panX) / 100, cw - dw, 0),
    dy: clamp(fy - (dh * panY) / 100, ch - dh, 0),
  };
}

/** Load order: first frame, chapter frames, then progressively denser passes (down to `finest` step). */
function loadOrder(finest: number) {
  const seen = new Set<number>();
  const order: number[] = [];
  const push = (n: number) => {
    if (n >= 0 && n < FRAME_COUNT && !seen.has(n)) {
      seen.add(n);
      order.push(n);
    }
  };
  push(0);
  chapters.forEach((c) => c.frames.forEach((f) => push(f - (f % finest))));
  for (const step of [16, 8, 4, 2, 1].filter((s) => s >= finest)) for (let n = 0; n < FRAME_COUNT; n += step) push(n);
  return order;
}

const textShadow = {
  textShadow: "0 1px 3px rgba(0,0,0,0.55), 0 0 24px rgba(0,0,0,0.6), 0 0 64px rgba(0,0,0,0.45)",
} satisfies CSSProperties;

export function ScrollSequence() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState({ chapter: -1, hotspot: -1 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  // Read by the render loop every frame; kept out of React state so scrolling never re-renders.
  const live = useRef({ frame: 0, panX: 50, panY: 50, zoom: 1, chapter: -1 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Written directly: motion's scroll-timeline acceleration of opacity proved unreliable here.
    const t = Math.min(p / 0.05, 1);
    if (introRef.current) {
      introRef.current.style.opacity = String(1 - t);
      introRef.current.style.transform = `translateY(${-48 * t}px)`;
    }

    const next = activeAt(p);
    const spot = next.chapter >= 0 ? chapters[next.chapter].hotspots[next.hotspot] : null;
    Object.assign(live.current, {
      frame: frameAt(p),
      panX: spot?.x ?? 50,
      panY: spot?.y ?? 50,
      // Slow push-in that eases back out, so the picture keeps moving while labels play.
      zoom: next.chapter >= 0 ? 1 + 0.06 * Math.sin(Math.PI * next.t) : 1,
      chapter: next.chapter,
    });
    setActive((prev) =>
      prev.chapter === next.chapter && prev.hotspot === next.hotspot ? prev : { chapter: next.chapter, hotspot: next.hotspot },
    );
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const panel = panelRef.current;
    if (!canvas || !panel) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = window.innerWidth < 768 ? "sm" : "lg";
    const images: (HTMLImageElement | null)[] = Array(FRAME_COUNT).fill(null);
    let cancelled = false;

    // Phones only have even frames; desktop fills in every frame last.
    const order = loadOrder(size === "sm" ? 2 : 1);
    const load = (n: number) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled) images[n] = img;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameSrc(size, n);
      });
    // Six parallel lanes keep the first frames arriving fast without flooding the connection.
    let cursor = 0;
    const lane = async () => {
      while (!cancelled && cursor < order.length) await load(order[cursor++]);
    };
    for (let i = 0; i < 6; i++) void lane();

    let cw = 0;
    let ch = 0;
    const cur = { ...live.current };
    let drawnKey = "";

    const resize = () => {
      const r = panel.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = r.width;
      ch = r.height;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      // Resizing a canvas resets its context state.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      drawnKey = "";
    };
    const ro = new ResizeObserver(resize);
    ro.observe(panel);
    resize();

    const nearest = (n: number) => {
      for (let d = 0; d < FRAME_COUNT; d++) {
        if (images[n - d]) return images[n - d];
        if (images[n + d]) return images[n + d];
      }
      return null;
    };

    const approach = (key: "frame" | "panX" | "panY" | "zoom", ease: number, snap: number) => {
      const target = live.current[key];
      cur[key] += (target - cur[key]) * (reduce ? 1 : ease);
      if (Math.abs(target - cur[key]) < snap) cur[key] = target;
    };

    let raf = 0;
    const tick = () => {
      approach("frame", 0.16, 0.02);
      approach("panX", 0.08, 0.02);
      approach("panY", 0.08, 0.02);
      approach("zoom", 0.1, 0.0005);

      const n = Math.round(cur.frame);
      const img = nearest(n);
      const key = `${live.current.chapter}|${n}|${cur.panX.toFixed(2)}|${cur.panY.toFixed(2)}|${cur.zoom.toFixed(4)}|${cw}x${ch}|${img?.src}`;
      if (img && key !== drawnKey) {
        const { dw, dh, dx, dy } = coverBox(cw, ch, cur.panX, cur.panY, cur.zoom);
        ctx.drawImage(img, dx, dy, dw, dh);
        // Screen position of every label in the active chapter, consumed by CSS.
        const chapter = chapters[live.current.chapter];
        chapter?.hotspots.forEach((h, i) => {
          panel.style.setProperty(`--hx${i}`, `${dx + (dw * h.x) / 100}px`);
          panel.style.setProperty(`--hy${i}`, `${dy + (dh * h.y) / 100}px`);
        });
        if (!drawnKey) setReady(true);
        drawnKey = key;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduce]);

  const chapter = active.chapter >= 0 ? chapters[active.chapter] : null;
  const spot = chapter ? chapter.hotspots[active.hotspot] : null;

  return (
    <section ref={sectionRef} aria-labelledby="sequence-title" className="relative -mx-6 h-[800vh] w-[calc(100%+3rem)] md:h-[900vh]">
      <div ref={panelRef} className="sticky top-0 h-svh w-full overflow-hidden bg-neutral-900">
        {/* Poster frame: server-rendered, paints before the canvas takes over. */}
        <Image
          src={frameSrc("lg", 0)}
          alt="Stage styled by Luxe & Allure: monogram backdrop, ivory armchairs and tropical greenery."
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
        />
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

        {/* Even, light tone-down while labels are up (legibility on cream fabrics) — deliberately not a spotlight. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/25 transition-opacity duration-700"
          style={{ opacity: chapter ? 1 : 0 }}
        />

        {/* The label sits on the detail it names: position comes from --hx/--hy, set by the render loop. */}
        <AnimatePresence mode="wait">
          {chapter && spot && (
            <motion.div
              key={`${chapter.id}-${active.hotspot}`}
              aria-hidden
              exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: reduce ? 0 : 0.25 } }}
              className="pointer-events-none absolute w-[min(320px,78vw)] -translate-x-1/2 -translate-y-1/2 text-center text-white"
              style={{
                left: `clamp(calc(min(320px, 78vw) / 2 + 16px), var(--hx${active.hotspot}, 50%), calc(100% - min(320px, 78vw) / 2 - 16px))`,
                // Bottom limit keeps labels clear of the chapter title.
                top: `clamp(110px, var(--hy${active.hotspot}, 50%), calc(100% - 280px))`,
              }}
            >
              <p className="font-display text-4xl font-medium leading-[0.95] tracking-tight md:text-5xl" style={textShadow}>
                {spot.label.split(" ").map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    className="inline-block"
                    initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </p>
              <motion.p
                className="mt-2 text-sm font-medium text-white/90 md:text-base"
                style={textShadow}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                {spot.note}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legibility scrim for the chapter title. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent" />

        <div className="pointer-events-none absolute bottom-8 left-6 right-6 md:bottom-12 md:left-12">
          <AnimatePresence mode="wait">
            {chapter && (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-white"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  {String(active.chapter + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
                </p>
                <p className="mt-1 font-display text-5xl font-medium leading-none tracking-tight md:text-7xl">{chapter.title}</p>
                <p className="mt-2 text-sm text-white/80 md:text-base">{chapter.kicker}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hero: the first frame, full screen, with the tagline. */}
        <div
          ref={introRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/55 via-black/30 to-black/60 px-6 text-center text-white"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/85 md:text-xs" style={textShadow}>
            Luxury event décor &amp; planning · Nairobi
          </p>
          <h1
            id="sequence-title"
            className="mt-5 max-w-5xl font-display text-5xl font-medium leading-[0.95] tracking-tight sm:text-6xl md:text-8xl"
            style={textShadow}
          >
            Every detail, designed to be remembered.
          </h1>
          <p className="mt-6 max-w-lg text-sm text-white/90 md:text-lg" style={textShadow}>
            Scroll to step inside one of our events, from the stage to the sky.
          </p>
          <span className="absolute bottom-8 flex flex-col items-center gap-1 text-[11px] uppercase tracking-[0.3em] text-white/80">
            Scroll
            <ChevronDown className="size-4 motion-safe:animate-bounce" />
          </span>
        </div>
      </div>

      {/* Same story as text, for screen readers and crawlers. */}
      <ol className="sr-only">
        {chapters.map((c) => (
          <li key={c.id}>
            <h2>{c.title}</h2>
            <p>{c.kicker}</p>
            <ul>
              {c.hotspots.map((h) => (
                <li key={h.label}>
                  {h.label}: {h.note}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

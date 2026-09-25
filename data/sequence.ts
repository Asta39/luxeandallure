// Scroll-linked frame sequence: a walk through a real Luxe & Allure event.
// 300 frames (upscaled from the event clip) live in /public/sequence/lg/000.webp…299.webp.
// Phones get every second frame only (/public/sequence/sm/000, 002, …) to spare mobile data.
// Hotspot x/y are % of the full 16:9 frame at the chapter's hold frame.

export const FRAME_COUNT = 300;
export const frameSrc = (size: "lg" | "sm", n: number) => `/sequence/${size}/${String(n).padStart(3, "0")}.webp`;

export type Hotspot = {
  label: string;
  note: string;
  x: number;
  y: number;
};

export type Chapter = {
  id: string;
  title: string;
  kicker: string;
  /** Frames the camera drifts between while the chapter's labels play (kept close so labels stay on target). */
  frames: [number, number];
  /** Scroll progress [start, end] of that slow drift. */
  hold: [number, number];
  hotspots: Hotspot[];
};

export const chapters: Chapter[] = [
  {
    id: "stage",
    title: "The Stage",
    kicker: "Where every eye lands first.",
    frames: [22, 28],
    hold: [0.07, 0.2],
    hotspots: [
      { label: "Monogram backdrop", note: "A custom gold initial set on a textured hide panel.", x: 52, y: 19 },
      { label: "Tufted accent chairs", note: "Ivory wingbacks with brass studs, styled as a pair.", x: 37, y: 60 },
      { label: "Tropical greenery", note: "Monstera and palm columns framing the stage.", x: 85, y: 42 },
      { label: "Swagged wall draping", note: "Layered champagne fabric, pleated and crossed.", x: 10, y: 22 },
    ],
  },
  {
    id: "reception",
    title: "The Reception",
    kicker: "Tables dressed to be remembered.",
    frames: [110, 118],
    hold: [0.32, 0.44],
    hotspots: [
      { label: "Tall floral centrepieces", note: "Roses in burnt orange and red, raised on gold stands.", x: 29, y: 31 },
      { label: "Satin table runners", note: "Champagne satin pooled to the grass.", x: 77, y: 80 },
      { label: "Cross-back chairs", note: "Natural wood with ivory cushions, from our hire range.", x: 25, y: 76 },
      { label: "Sheer ceiling drops", note: "Soft fabric falls that frame each table.", x: 67, y: 16 },
    ],
  },
  {
    id: "ceiling",
    title: "The Ceiling",
    kicker: "We style what you look up to.",
    frames: [172, 178],
    hold: [0.52, 0.61],
    hotspots: [
      { label: "Swagged ceiling draping", note: "Tiered champagne swags across every bay.", x: 34, y: 38 },
      { label: "Festoon lighting", note: "Warm bulb strings tracing the tent frame.", x: 72, y: 12 },
    ],
  },
  {
    id: "installation",
    title: "The Statement",
    kicker: "One piece everyone photographs.",
    frames: [212, 216],
    hold: [0.68, 0.79],
    hotspots: [
      { label: "Suspended greenery", note: "A hanging canopy of monstera, palm and fern.", x: 36, y: 17 },
      { label: "Crystal chandelier", note: "Set at the heart of the installation.", x: 50, y: 62 },
      { label: "Woven rattan pendants", note: "Warm, textured light around the chandelier.", x: 72, y: 43 },
    ],
  },
  {
    id: "venue",
    title: "The Venue",
    kicker: "And the tent it all lives in.",
    frames: [276, 292],
    hold: [0.88, 0.97],
    hotspots: [
      { label: "Sailcloth marquee", note: "Tent hire for garden weddings and large receptions.", x: 50, y: 47 },
      { label: "Lit perimeter drapes", note: "Draped sides glowing at dusk.", x: 25, y: 60 },
    ],
  },
];

/** Piecewise-linear scroll progress → frame map. Holds slow the camera to a drift while labels play. */
export const timeline: [progress: number, frame: number][] = [
  [0, 0],
  ...chapters.flatMap((c) => [
    [c.hold[0], c.frames[0]] as [number, number],
    [c.hold[1], c.frames[1]] as [number, number],
  ]),
  [1, FRAME_COUNT - 1],
];

export function frameAt(p: number) {
  for (let i = 1; i < timeline.length; i++) {
    const [p1, f1] = timeline[i];
    const [p0, f0] = timeline[i - 1];
    if (p <= p1) return f0 + ((f1 - f0) * (p - p0)) / Math.max(p1 - p0, 1e-6);
  }
  return FRAME_COUNT - 1;
}

/** Which chapter and hotspot are active at progress p (hotspots split the hold evenly); t is 0–1 through the hold. */
export function activeAt(p: number) {
  const ci = chapters.findIndex((c) => p >= c.hold[0] - 0.015 && p <= c.hold[1] + 0.015);
  if (ci === -1) return { chapter: -1, hotspot: -1, t: 0 };
  const c = chapters[ci];
  const t = Math.min(Math.max((p - c.hold[0]) / (c.hold[1] - c.hold[0]), 0), 0.999);
  return { chapter: ci, hotspot: Math.floor(t * c.hotspots.length), t };
}

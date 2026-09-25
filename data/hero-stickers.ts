// Hero sticker canvas layout. x/y are the sticker centre as a % of the canvas.
// `m` is the mobile position; stickers without `m` are hidden below md.
// `size` is the desktop width in px (it scales down with the canvas, never below half).

export type ImageSticker = {
  kind: "image";
  src: string;
  size: number;
  rot: number;
  x: number;
  y: number;
  m?: [number, number];
};

export type PillSticker = {
  kind: "pill";
  label: string;
  className: string;
  rot: number;
  x: number;
  y: number;
  m?: [number, number];
};

export type HeroSticker = ImageSticker | PillSticker;

const die = (name: string) => `/stickers/die/${name}.webp`;

export const heroStickers: HeroSticker[] = [
  // top band
  { kind: "image", src: die("face-bride"), size: 150, rot: -6, x: 9, y: 17, m: [16, 10] },
  { kind: "image", src: die("ring"), size: 100, rot: 10, x: 21, y: 7 },
  { kind: "image", src: die("flutes"), size: 120, rot: -10, x: 32, y: 15, m: [30, 24] },
  { kind: "image", src: die("face-party"), size: 150, rot: 6, x: 46, y: 8, m: [50, 7] },
  { kind: "image", src: die("crown"), size: 110, rot: -6, x: 58, y: 16 },
  { kind: "image", src: die("corporate"), size: 120, rot: 8, x: 69, y: 8 },
  { kind: "image", src: die("balloons"), size: 140, rot: 6, x: 81, y: 17, m: [70, 24] },
  { kind: "image", src: die("face-star"), size: 130, rot: -8, x: 92, y: 9, m: [85, 11] },
  // sides
  { kind: "image", src: die("wedding"), size: 130, rot: -5, x: 6, y: 45, m: [13, 74] },
  { kind: "image", src: die("lighting"), size: 105, rot: 8, x: 16, y: 33 },
  { kind: "image", src: die("hire"), size: 120, rot: -8, x: 14, y: 53 },
  { kind: "image", src: die("vip"), size: 120, rot: 6, x: 94, y: 39 },
  { kind: "image", src: die("face-vip"), size: 140, rot: -6, x: 82, y: 33, m: [45, 83] },
  { kind: "image", src: die("decor"), size: 120, rot: 8, x: 95, y: 57 },
  { kind: "image", src: die("photography"), size: 110, rot: -8, x: 87, y: 49 },
  // bottom band
  { kind: "image", src: die("shower"), size: 130, rot: -6, x: 6, y: 77, m: [84, 90] },
  { kind: "image", src: die("birthday"), size: 115, rot: 8, x: 18, y: 86, m: [24, 87] },
  { kind: "image", src: die("face-gift"), size: 140, rot: -4, x: 29, y: 75 },
  { kind: "image", src: die("chandelier"), size: 120, rot: 6, x: 40, y: 86 },
  { kind: "image", src: die("catering"), size: 120, rot: -8, x: 52, y: 79 },
  { kind: "image", src: die("entertainment"), size: 110, rot: 8, x: 63, y: 87 },
  { kind: "image", src: die("face-laugh"), size: 150, rot: -6, x: 73, y: 76, m: [80, 76] },
  // label stickers (plain text, so they stay crisp and crawlable later)
  { kind: "pill", label: "Weddings", className: "font-display text-2xl italic", rot: -6, x: 23, y: 26 },
  { kind: "pill", label: "CORPORATE", className: "text-sm font-bold tracking-[0.3em]", rot: 5, x: 76, y: 24 },
  { kind: "pill", label: "Tent Hire", className: "text-xl font-bold tracking-tight", rot: -4, x: 13, y: 65 },
  { kind: "pill", label: "Milestones", className: "font-display text-2xl font-semibold", rot: 6, x: 86, y: 68 },
  { kind: "pill", label: "VIP EVENTS", className: "text-sm font-bold tracking-[0.25em]", rot: -5, x: 87, y: 84 },
  { kind: "pill", label: "Nairobi", className: "text-xl font-bold tracking-tighter", rot: 4, x: 8, y: 90 },
];

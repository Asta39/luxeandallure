"use client";

import { useRef, useState, type CSSProperties, type RefObject } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Hand } from "lucide-react";
import { SparklesText } from "@/components/ui/sparkles-text";
import { heroStickers, type HeroSticker } from "@/data/hero-stickers";
import { cn } from "@/lib/utils";

const sparkleColors = { first: "#e47c75", second: "#b6282c" };

function Sticker({
  item,
  index,
  bounds,
  nextZ,
}: {
  item: HeroSticker;
  index: number;
  bounds: RefObject<HTMLDivElement | null>;
  nextZ: () => number;
}) {
  const [z, setZ] = useState(10);
  const width =
    item.kind === "image"
      ? `clamp(${Math.round(item.size * 0.5)}px, ${(item.size / 14).toFixed(2)}cqw, ${item.size}px)`
      : undefined;

  const style = {
    "--x": `${item.x}%`,
    "--y": `${item.y}%`,
    "--mx": `${item.m?.[0] ?? item.x}%`,
    "--my": `${item.m?.[1] ?? item.y}%`,
    zIndex: z,
    width,
  } as CSSProperties;

  return (
    <div
      style={style}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 left-[var(--mx)] top-[var(--my)] md:left-[var(--x)] md:top-[var(--y)]",
        !item.m && "hidden md:block",
      )}
    >
      <motion.div
        drag
        dragConstraints={bounds}
        dragElastic={0.12}
        dragTransition={{ power: 0.18, timeConstant: 220, bounceStiffness: 260, bounceDamping: 18 }}
        onPointerDown={() => setZ(nextZ())}
        initial={{ scale: 0, rotate: item.rot - 25, opacity: 0 }}
        animate={{ scale: 1, rotate: item.rot, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 + index * 0.035 }}
        whileHover={{ scale: 1.07 }}
        whileDrag={{ scale: 1.14, rotate: 0 }}
        className="cursor-grab touch-none select-none active:cursor-grabbing"
      >
        {item.kind === "image" ? (
          <Image
            src={item.src}
            alt=""
            width={300}
            height={300}
            sizes="(min-width: 768px) 150px, 80px"
            draggable={false}
            className="pointer-events-none h-auto w-full drop-shadow-[0_10px_14px_rgba(53,52,52,0.18)]"
          />
        ) : (
          <span
            className={cn(
              "block whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-brand-900 shadow-[0_8px_20px_rgba(53,52,52,0.14)] ring-1 ring-black/5",
              item.className,
            )}
          >
            {item.label}
          </span>
        )}
      </motion.div>
    </div>
  );
}

export function StickerCanvas() {
  const reduce = useReducedMotion();
  const bounds = useRef<HTMLDivElement>(null);
  const zCounter = useRef(10);
  const nextZ = () => ++zCounter.current;

  return (
    <div
      ref={bounds}
      className="relative h-[640px] w-full overflow-hidden rounded-[32px] border border-line bg-neutral-50 [container-type:inline-size] md:h-[720px] md:rounded-[44px]"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(53,52,52,0.11) 1px, transparent 1.4px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center px-6">
        <div className="text-center">
          <h2>
            <SparklesText
              colors={sparkleColors}
              sparklesCount={reduce ? 0 : 14}
              className="text-[2.75rem] leading-[0.92] tracking-tighter text-brand-900 sm:text-7xl lg:text-[6.5rem]"
            >
              <span className="block">Creating</span>
              <span className="block">unforgettable</span>
              <span className="block">moments</span>
            </SparklesText>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm text-muted md:text-lg">
            Luxury event decor, planning and hire in Nairobi.
          </p>
        </div>
      </div>

      {heroStickers.map((item, i) => (
        <Sticker key={`${item.kind}-${i}`} item={item} index={i} bounds={bounds} nextZ={nextZ} />
      ))}

      <p className="pointer-events-none absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-xs text-muted md:text-sm">
        <Hand className="size-4" />
        Drag the stickers around.
      </p>
    </div>
  );
}

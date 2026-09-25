"use client";

import { MotionConfig, useReducedMotion } from "motion/react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
      {/* Momentum scrolling so wheel notches glide instead of jumping frames. Native scroll for reduced motion. */}
      {!reduce && <ReactLenis root options={{ lerp: 0.085, smoothWheel: true, anchors: true }} />}
      {children}
    </MotionConfig>
  );
}

"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

// Lenis honours prefers-reduced-motion natively (it drops the smoothing).
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.6 }}>
      {children}
    </ReactLenis>
  );
}

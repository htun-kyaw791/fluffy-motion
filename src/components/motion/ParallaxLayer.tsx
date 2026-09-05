"use client";

import { motion, useTransform } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useTrack } from "./TrackContext";

type Band = { bottom: string; height: string };

export function ParallaxLayer({
  depth,
  band,
  children,
  className = "",
  style,
}: {
  depth: number;
  band?: Band;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const { progress, panels } = useTrack();

  const travel = (panels - 1) * 100 * depth; // vw
  const width = 100 + travel;
  const shift = (travel / width) * 100;

  const x = useTransform(progress, [0, 1], ["0%", `-${shift}%`]);

  return (
    <motion.div
      aria-hidden
      className={`parallax-layer pointer-events-none absolute inset-y-0 left-0 ${className}`}
      style={{
        ["--layer-w" as string]: `${width}vw`,
        x,
        ...(band && { top: "auto", bottom: band.bottom, height: band.height }),
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

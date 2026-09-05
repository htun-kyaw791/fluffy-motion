"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";
import { TrackContext } from "./TrackContext";

export function HorizontalTrack({
  panels,
  scrollPerPanel = 165,
  backdrop,
  children,
}: {
  panels: number;
  scrollPerPanel?: number;
  backdrop?: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [
    "0%",
    `-${((panels - 1) / panels) * 100}%`,
  ]);

  return (
    <TrackContext.Provider value={{ progress: scrollYProgress, panels }}>
      <section
        ref={ref}
        className="track-spacer"
        style={{
          ["--panels" as string]: panels,
          ["--panel-scroll" as string]: `${scrollPerPanel}vh`,
        }}
      >
        <div className="track-viewport">
          {backdrop}
          <motion.div className="track-strip relative" style={{ x }}>
            {children}
          </motion.div>
        </div>
      </section>
    </TrackContext.Provider>
  );
}

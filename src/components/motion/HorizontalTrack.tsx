"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { beats } from "@/lib/scene";
import { TrackContext } from "./TrackContext";
import { useTrackSnap } from "./useTrackSnap";

export function HorizontalTrack({
  panels,
  scrollPerPanel = 800,
  snap = true,
  snapSeconds = 10,
  snapBackSeconds = 1.2,
  magnet,
  backdrop,
  children,
}: {
  panels: number;
  scrollPerPanel?: number;
  snap?: boolean;
  snapSeconds?: number;
  snapBackSeconds?: number;
  magnet?: number;
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

  const targets = useMemo(() => (snap ? beats(panels) : []), [snap, panels]);

  useTrackSnap(ref, {
    targets,
    seconds: snapSeconds,
    backSeconds: snapBackSeconds,
    magnet,
  });

  return (
    <TrackContext.Provider value={{ progress: scrollYProgress, panels, seconds: snapSeconds }}>
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

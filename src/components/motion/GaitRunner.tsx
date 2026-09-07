"use client";

import { motion, useReducedMotion, useTransform } from "motion/react";
import { useTrack } from "@/components/motion/TrackContext";
import { SceneImage } from "@/components/ui/SceneImage";
import { u } from "@/lib/scene";
import type { Lane } from "@/lib/scene";

const FRAMES = [1, 2, 3, 4];

const FRAME_ASPECT = "2.06 / 1";

const PATH_START = -25; // vw
const PATH_SPAN = 150; // vw

const mod = (n: number, m: number) => ((n % m) + m) % m;

export function GaitRunner({
  gait,
  h,
  bottom,
  crossSeconds,
  cycles,
  offset,
  opacity,
}: Lane) {
  const { progress, panels, seconds } = useTrack();
  const reduced = useReducedMotion();
  const laps = (seconds * Math.max(1, panels - 3)) / crossSeconds;
  const lap = useTransform(progress, (p) => offset + p * laps);
  const x = useTransform(lap, (l) => `${PATH_START + mod(l, 1) * PATH_SPAN}vw`);
  const strip = useTransform(lap, (l) => `${mod(Math.floor(l * cycles * 4), 4) * -25}%`);

  return (
    <motion.div
      className="absolute"
      style={{
        bottom: `calc(var(--horizon) * ${bottom})`,
        height: u(h),
        opacity,
        x: reduced ? "28vw" : x,
      }}
    >
      <div className="h-full overflow-hidden" style={{ aspectRatio: FRAME_ASPECT }}>
        <motion.div
          className="flex h-full"
          style={{ width: "400%", x: reduced ? "0%" : strip }}
        >
          {FRAMES.map((f) => (
            <SceneImage
              key={f}
              src={`/figures/dog/dog-${gait}-0${f}.svg`}
              loading="eager"
              className="h-full w-1/4 shrink-0 object-contain"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

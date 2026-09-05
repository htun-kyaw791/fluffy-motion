"use client";

import { motion, useTransform } from "motion/react";
import { useTrack } from "@/components/motion/TrackContext";
import { SceneImage } from "@/components/ui/SceneImage";
import { ASPECT, u } from "@/lib/scene";
import type { Clump, Leaf } from "@/lib/scene";

export function GrassBand({ heightVh, clumps }: { heightVh: number; clumps: Clump[] }) {
  const tile = heightVh * ASPECT.grass;

  return (
    <>
      {clumps.map((c, i) => {
        const span = Math.max(tile - c.w, 0);
        const offset = span > 0 ? -((i * 37) % span) : 0;
        return (
          <div
            key={i}
            className="absolute bottom-0 h-full"
            style={{
              left: `${c.x}%`,
              width: u(c.w),
              backgroundImage: "url(/scene/grass.svg)",
              backgroundRepeat: "no-repeat",
              backgroundSize: `${u(tile)} 100%`,
              backgroundPositionX: u(offset),
              backgroundPositionY: "bottom",
            }}
          />
        );
      })}
    </>
  );
}


export function LeafLitter({ leaves, wind }: { leaves: Leaf[]; wind: number }) {
  const { progress } = useTrack();
  const x = useTransform(progress, [0, 1], ["0vw", `-${wind}vw`]);

  return (
    <motion.div className="absolute inset-0" style={{ x }}>
      {leaves.map((l, i) => (
        <SceneImage
          key={i}
          src={l.src}
          className="absolute w-auto max-w-none"
          style={{
            left: `${l.x}%`,
            bottom: `${l.y * 100}%`,
            height: u(l.h),
            opacity: l.opacity,
            // translate carries the half-shift, transform the pose.
            translate: "-50% 50%",
            transform: `rotate(${l.rot}deg) scaleX(${l.flip ? -1 : 1})`,
          }}
        />
      ))}
    </motion.div>
  );
}

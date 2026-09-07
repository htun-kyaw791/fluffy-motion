"use client";

import { useMotionValueEvent, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useTrack } from "@/components/motion/TrackContext";
import { MotionSceneImage, SceneImage } from "@/components/ui/SceneImage";
import { FLOAT } from "@/lib/motion";
import { DEPTH, jitter, stanceWindow, u, zoneX } from "@/lib/scene";
import type { Leaf, Stance } from "@/lib/scene";

const KICK = 55;
const LIFT = 85;
const FRAME_MS = 90;

function FootLitter({ leaves, frame }: { leaves: Leaf[]; frame: number }) {
  const reduced = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute bottom-0 left-1/2 w-[220%] -translate-x-1/2"
      style={{ height: u(5) }}
    >
      {leaves.map((l, k) => (
        <MotionSceneImage
          key={k}
          src={l.src}
          className="absolute w-auto max-w-none"
          style={{
            left: `${l.x}%`,
            bottom: `${l.y * 100}%`,
            height: u(l.h),
            opacity: l.opacity,
            translate: "-50% 50%",
          }}
          animate={
            reduced
              ? { x: 0, y: 0, rotate: l.rot }
              : {
                  x: `${(jitter(k, frame) - 0.5) * KICK}%`,
                  y: `${-jitter(k + 97, frame) * LIFT}%`,
                  rotate: l.rot + (jitter(k + 197, frame) - 0.5) * 55,
                }
          }
          transition={
            reduced ? { duration: 0 } : { type: "spring", ...FLOAT, delay: k * 0.03 }
          }
        />
      ))}
    </div>
  );
}

export function StanceFigure({
  stance,
  litter,
  play = true,
}: {
  stance: Stance;
  litter: Leaf[];
  play?: boolean;
}) {
  const { progress, panels } = useTrack();
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const n = stance.frames.length;
  const { from, to } = stanceWindow(DEPTH.stance, panels, stance.scene, stance.t);

  const scrollDriven = to > from;

  useMotionValueEvent(progress, "change", (p) => {
    if (!scrollDriven) return;
    const span = (p - from) / (to - from);
    const next = Math.min(n - 1, Math.max(0, Math.floor(span * n)));
    setI((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    if (scrollDriven || !play || reduced) return;

    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      setI(frame);
      if (frame >= n - 1) clearInterval(id);
    }, FRAME_MS);

    return () => clearInterval(id);
  }, [scrollDriven, play, reduced, n]);

  const shown = !scrollDriven && reduced ? n - 1 : i;

  return (
    <div
      className="absolute bottom-0 -translate-x-1/2"
      style={{
        left: `${zoneX(DEPTH.stance, panels, stance.scene, stance.t)}%`,
        height: u(stance.h),
        width: u(stance.h * stance.aspect),
      }}
    >
      {stance.frames.map((src, j) =>
        Math.abs(j - shown) <= 1 ? (
          <SceneImage
            key={src}
            src={src}
            loading="eager"
            className="absolute inset-0 h-full w-full object-contain object-bottom transition-opacity duration-100"
            style={{ opacity: j === shown ? 1 : 0 }}
          />
        ) : null,
      )}

      <FootLitter leaves={litter} frame={shown} />
    </div>
  );
}

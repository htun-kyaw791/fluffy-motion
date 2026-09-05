"use client";

import { useTransform } from "motion/react";
import { useTrack } from "@/components/motion/TrackContext";
import { MotionSceneImage } from "@/components/ui/SceneImage";
import { ramp } from "@/lib/motion";
import { u, zoneX } from "@/lib/scene";
import type { Vanisher } from "@/lib/scene";

export function Kawarimi({ v, depth }: { v: Vanisher; depth: number }) {
  const { progress, panels } = useTrack();

  const travel = (panels - 1) * 100 * depth;
  const xVw = (travel * v.scene) / (panels - 1) + v.t * 100;
  const c = Math.min(Math.max((xVw - 50) / travel, 0.12), 0.88);

  const ninjaOpacity = useTransform(progress, (p) => 1 - ramp(p, c - 0.004, c + 0.006));
  const smokeOpacity = useTransform(progress, [c - 0.006, c + 0.012, c + 0.042], [0, 0.85, 0]);
  const smokeScale = useTransform(progress, [c - 0.006, c + 0.042], [0.35, 1.6]);

  const logOpacity = useTransform(progress, (p) => ramp(p, c + 0.008, c + 0.016));

  const logY = useTransform(
    progress,
    [c + 0.016, c + 0.026, c + 0.033, c + 0.038, c + 0.041],
    ["-46%", "-40%", "-23%", "-3%", "0%"],
  );
  const logRotate = useTransform(
    progress,
    [c + 0.016, c + 0.026, c + 0.033, c + 0.038, c + 0.041],
    [10, 9.4, 6, -5, 0],
  );

  return (
    <div
      className="absolute bottom-0"
      style={{ left: `${zoneX(depth, panels, v.scene, v.t)}%` }}
    >
      <MotionSceneImage
        src={v.ninja}
        className="absolute bottom-0 left-0 w-auto max-w-none"
        style={{
          height: u(v.h),
          opacity: ninjaOpacity,
          x: "-50%",
          scaleX: v.flip ? -1 : 1,
        }}
      />
      <MotionSceneImage
        src={v.smoke}
        className="absolute bottom-0 left-0 w-auto max-w-none origin-bottom"
        style={{ height: u(v.h * 1.5), opacity: smokeOpacity, x: "-50%", scale: smokeScale }}
      />
      <MotionSceneImage
        src="/scene/wood.svg"
        className="absolute bottom-0 left-0 w-auto max-w-none"
        style={{
          height: u(v.logH),
          opacity: logOpacity,
          x: "-50%",
          y: logY,
          rotate: logRotate,
        }}
      />
    </div>
  );
}

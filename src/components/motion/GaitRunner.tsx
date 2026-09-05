"use client";

import { SceneImage } from "@/components/ui/SceneImage";
import { u } from "@/lib/scene";
import type { Lane } from "@/lib/scene";

const FRAMES = [1, 2, 3, 4];

/** Width / height of one frame box in the dog sets. */
const FRAME_ASPECT = "2.06 / 1";

export function GaitRunner({ gait, h, bottom, cycle, cross, delay, opacity }: Lane) {
  return (
    <div
      className="runner absolute"
      style={{
        bottom: `calc(var(--horizon) * ${bottom})`,
        height: u(h),
        opacity,
        ["--cross" as string]: `${cross}s`,
        ["--run-delay" as string]: `${delay}s`,
      }}
    >
      <div className="h-full overflow-hidden" style={{ aspectRatio: FRAME_ASPECT }}>
        {/* 4 frames in a strip 4x the window width; steps(4) lands on each. */}
        <div
          className="gait-strip flex h-full"
          style={{ width: "400%", ["--cycle" as string]: `${cycle}s` }}
        >
          {FRAMES.map((f) => (
            <SceneImage
              key={f}
              src={`/figures/dog/dog-${gait}-0${f}.svg`}
              loading="eager"
              className="h-full w-1/4 shrink-0 object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

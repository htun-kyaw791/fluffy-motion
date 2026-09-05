"use client";

import { Bubble } from "@/components/motion/Bubble";
import { useTrack } from "@/components/motion/TrackContext";
import { SceneImage } from "@/components/ui/SceneImage";
import { u, zoneX } from "@/lib/scene";
import type { Placed } from "@/lib/scene";

export function Structures({
  items,
  depth,
  opacity,
}: {
  items: Placed[];
  depth: number;
  opacity: number;
}) {
  const { panels } = useTrack();

  return (
    <>
      {items.map((b, i) => (
        <Bubble
          key={`${b.src}-${i}`}
          origin="bottom"
          className="absolute bottom-0"
          style={{ left: `${zoneX(depth, panels, b.scene, b.t)}%`, height: u(b.h), opacity }}
        >
          <SceneImage
            src={b.src}
            className="h-full w-auto max-w-none"
            style={{ transform: b.flip ? "scaleX(-1)" : undefined }}
          />
        </Bubble>
      ))}
    </>
  );
}

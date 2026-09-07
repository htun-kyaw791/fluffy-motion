"use client";

import { motion, useTransform } from "motion/react";
import { Bubble } from "@/components/motion/Bubble";
import { useTrack } from "@/components/motion/TrackContext";
import { SceneImage } from "@/components/ui/SceneImage";
import { MOON, RELICS, RELIC_DELAY_MAX, RELIC_SPAN, RELIC_WINDOW, u } from "@/lib/scene";
import type { Relic as RelicData } from "@/lib/scene";


function Relic({ r }: { r: RelicData }) {
  const { progress } = useTrack();

  const from =
    RELIC_WINDOW.from +
    (r.delay / RELIC_DELAY_MAX) * (RELIC_WINDOW.to - RELIC_WINDOW.from - RELIC_SPAN);
  const to = from + RELIC_SPAN;

  const x = useTransform(progress, [from, to], ["0vw", `${r.dx}vw`]);
  const y = useTransform(progress, [from, to], ["0vh", `${r.dy}vh`]);
  const rotate = useTransform(progress, [from, to], [0, r.spin]);
  const scale = useTransform(progress, [from, from + (to - from) * 0.72, to], [0, 1.12, 1]);

  return (
    <motion.div className="absolute top-0 left-0" style={{ x, y, rotate, scale }}>
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.12}
        whileDrag={{ scale: 1.08 }}
      >
        <div
          className="relic-drift"
          style={{
            ["--drift" as string]: `${r.drift}s`,
            ["--drift-delay" as string]: `${r.driftDelay}s`,
            ["--amp" as string]: r.amp,
          }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2">
            <Bubble
              lens={0.95}
              bulge={0.1}
              className="relative cursor-grab active:cursor-grabbing"
            >
              <SceneImage
                src={r.src}
                className="w-auto max-w-none"
                style={{ height: u(r.h) }}
              />
            </Bubble>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Relics() {
  return (
    <div
      className="absolute"
      style={{
        left: `${MOON.left}%`,
        top: `${MOON.top + MOON.h / 2}vh`,
        marginLeft: u(MOON.h / 2),
      }}
    >
      {RELICS.map((r) => (
        <Relic key={r.src} r={r} />
      ))}
    </div>
  );
}

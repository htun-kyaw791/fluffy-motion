"use client";

import { motion, useReducedMotion, useTransform } from "motion/react";
import { Bubble } from "@/components/motion/Bubble";
import { usePhase } from "@/components/motion/PhaseStack";
import { useTrack } from "@/components/motion/TrackContext";
import { SceneImage } from "@/components/ui/SceneImage";
import { ramp } from "@/lib/motion";
import { CLOUDS, MOON, SUN, u } from "@/lib/scene";
import type { Cloud } from "@/lib/scene";

export function Sun() {
  const { progress } = useTrack();
  const reduced = useReducedMotion();

  const x = useTransform(progress, [0, 1], ["0vw", `${SUN.arc.dx}vw`]);
  const y = useTransform(progress, [0, 1], ["0vh", `${SUN.arc.dy}vh`]);
  const opacity = useTransform(progress, (p) => 1 - ramp(p, SUN.fade.from, SUN.fade.to));
  const warm = useTransform(progress, (p) => ramp(p, SUN.warm.from, SUN.warm.to));

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${SUN.left}%`,
        top: `${SUN.top}vh`,
        height: u(SUN.h),
        width: u(SUN.h),
        opacity: reduced ? 1 : opacity,
        ...(reduced ? null : { x, y }),
      }}
    >
      <Bubble lens={0.8} className="relative h-full w-full">
        <div className="h-full w-full rounded-full bg-linear-to-b from-paper-50 to-day-200" />
        <motion.div
          className="absolute inset-0 rounded-full bg-linear-to-b from-dusk-500 to-vermilion-600"
          style={{ opacity: reduced ? 0 : warm }}
        />
      </Bubble>
    </motion.div>
  );
}

export function Moon() {
  const { progress } = useTrack();
  const reduced = useReducedMotion();

  const y = useTransform(
    progress,
    [MOON.enter.from, MOON.enter.to],
    [`-${MOON.drop}vh`, "0vh"],
  );

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${MOON.left}%`,
        top: `${MOON.top}vh`,
        height: u(MOON.h),
        width: u(MOON.h),
        ...(reduced ? null : { y }),
      }}
    >
      <Bubble lens={0.85} className="relative h-full w-full">
        <div className="h-full w-full rounded-full bg-linear-to-b from-moon-400 to-moon-500 shadow-[0_0_6vh_2vh_var(--color-moon-500)]" />
      </Bubble>
    </motion.div>
  );
}

function DriftCloud({ cloud }: { cloud: Cloud }) {
  const { progress } = useTrack();
  const reduced = useReducedMotion();
  const opacity = usePhase((phase) => phase.cloud);

  const x = useTransform(progress, [0, 1], ["0vw", `${cloud.drift}vw`]);
  const y = useTransform(progress, [0, 1], ["0vh", `${cloud.sink}vh`]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${cloud.x}%`,
        top: `${cloud.y}vh`,
        height: u(cloud.h),
        opacity,
        ...(reduced ? null : { x, y }),
      }}
    >
      <Bubble lens={0.95} bulge={0.1} className="relative h-full">
        <SceneImage src={cloud.src} className="h-full w-auto max-w-none" />
      </Bubble>
    </motion.div>
  );
}

export function Clouds() {
  return (
    <>
      {CLOUDS.map((cloud, i) => (
        <DriftCloud key={`${cloud.src}-${i}`} cloud={cloud} />
      ))}
    </>
  );
}

"use client";

import { motion, useReducedMotion, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import type { CSSProperties } from "react";
import { useTrack } from "@/components/motion/TrackContext";
import { ramp } from "@/lib/motion";
import { PHASES } from "@/lib/scene";
import type { Phase } from "@/lib/scene";

const AT = PHASES.map((phase) => phase.at);

export function usePhase<T extends number | string>(pick: (phase: Phase) => T) {
  const { progress } = useTrack();
  return useTransform(progress, AT, PHASES.map(pick));
}

function PhaseLayer({
  progress,
  from,
  to,
  className,
  style,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  className: string;
  style?: CSSProperties;
}) {
  const opacity = useTransform(progress, (p) => ramp(p, from, to));

  return <motion.div aria-hidden className={className} style={{ ...style, opacity }} />;
}

export function PhaseStack({
  pick,
  className,
  style,
}: {
  pick: (phase: Phase) => string;
  className: string;
  style?: CSSProperties;
}) {
  const { progress } = useTrack();
  const reduced = useReducedMotion();
  const [base, ...rest] = PHASES;

  return (
    <>
      <div aria-hidden className={`${className} ${pick(base)}`} style={style} />
      {!reduced &&
        rest.map((phase, i) => (
          <PhaseLayer
            key={phase.at}
            progress={progress}
            from={PHASES[i].at}
            to={phase.at}
            className={`${className} ${pick(phase)}`}
            style={style}
          />
        ))}
    </>
  );
}

"use client";

import { createContext, useContext } from "react";
import type { MotionValue } from "motion/react";

type TrackValue = {
  progress: MotionValue<number>;
  panels: number;
};

export const TrackContext = createContext<TrackValue | null>(null);

export function useTrack(): TrackValue {
  const ctx = useContext(TrackContext);
  if (!ctx) throw new Error("useTrack must be used inside <HorizontalTrack>");
  return ctx;
}

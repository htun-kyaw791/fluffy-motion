"use client";

import { useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";

const EPSILON = 0.004;
const MIN_DURATION = 0.4;
const MAGNET_SLACK = 1.2;

const SWIPE = 8;

const SNAP_EASING = (t: number) => t;

function ahead(targets: number[], p: number, dir: 1 | -1): number | undefined {
  if (dir > 0) return targets.find((t) => t > p + EPSILON);
  for (let i = targets.length - 1; i >= 0; i--) {
    if (targets[i] < p - EPSILON) return targets[i];
  }
  return undefined;
}

export function useTrackSnap(
  ref: RefObject<HTMLElement | null>,
  {
    targets,
    seconds,
    backSeconds,
    magnet,
  }: {
    targets: number[];
    seconds: number;
    backSeconds: number;
    magnet?: number;
  },
) {
  const lenis = useLenis();
  const widest = useMemo(() => {
    let w = 0;
    for (let i = 1; i < targets.length; i++) {
      w = Math.max(w, targets[i] - targets[i - 1]);
    }
    return w;
  }, [targets]);

  const radius = magnet ?? widest * MAGNET_SLACK;
  const reduced = useReducedMotion();

  const busy = useRef(false);
  const guard = useRef<ReturnType<typeof setTimeout> | null>(null);

  const snap = useCallback(
    (dir: 1 | -1) => {
      const el = ref.current;
      if (!lenis || !el || busy.current || widest <= 0) return;

      if (lenis.isStopped) return;
      const top = el.offsetTop;
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;

      const p = (window.scrollY - top) / travel;
      if (p < -EPSILON || p > 1 + EPSILON) return;

      const target = ahead(targets, p, dir);
      if (target === undefined) return;

      const distance = Math.abs(target - p);
      if (distance > radius) return;

      const pace = dir < 0 ? backSeconds : seconds;
      const duration = Math.max(MIN_DURATION, pace * (distance / widest));
      const release = () => {
        busy.current = false;
        if (guard.current) clearTimeout(guard.current);
      };

      busy.current = true;

      guard.current = setTimeout(release, (duration + 0.3) * 1000);

      lenis.scrollTo(top + target * travel, {
        duration,
        easing: SNAP_EASING,
        lock: true,
        onComplete: release,
      });
    },
    [lenis, ref, targets, seconds, backSeconds, radius, widest],
  );

  useEffect(() => {
    if (reduced || !lenis) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY) snap(e.deltaY > 0 ? 1 : -1);
    };

    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = startY - (e.changedTouches[0]?.clientY ?? startY);
      if (Math.abs(delta) > SWIPE) snap(delta > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      
      const el = e.target as HTMLElement | null;
      if (el?.closest("a, button, input, select, textarea, [contenteditable]")) return;

      const down = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ";
      const up = e.key === "ArrowUp" || e.key === "PageUp";
      if (down || up) snap(down ? 1 : -1);
    };

    const passive = { passive: true } as const;
    window.addEventListener("wheel", onWheel, passive);
    window.addEventListener("touchstart", onTouchStart, passive);
    window.addEventListener("touchend", onTouchEnd, passive);
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      if (guard.current) clearTimeout(guard.current);
    };
  }, [reduced, lenis, snap]);
}

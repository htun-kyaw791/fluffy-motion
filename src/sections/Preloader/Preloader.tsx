"use client";

import { useLenis } from "lenis/react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SceneImage } from "@/components/ui/SceneImage";
import { DURATION, EASE } from "@/lib/motion";

const MIN_MS = 1100;
const RAMP_MS = 420;

export function Preloader({ onDone }: { onDone?: () => void }) {
  const [visible, setVisible] = useState(true);
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const done = useRef(false);
  const pct = useMotionValue(0);
  const label = useTransform(pct, (v) => String(Math.round(v)).padStart(3, "0"));
  const scaleX = useTransform(pct, (v) => v / 100);

  useEffect(() => {
    const started = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - started;
      pct.set(Math.min(99, (1 - Math.exp(-elapsed / RAMP_MS)) * 100));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const release = () => {
      if (done.current) return;
      done.current = true;
      cancelAnimationFrame(raf);
      pct.set(100);
      setVisible(false);
    };

    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((r) =>
            window.addEventListener("load", () => r(), { once: true }),
          );
    const floor = new Promise<void>((r) => setTimeout(r, MIN_MS));

    void Promise.all([loaded, floor]).then(release);

    return () => cancelAnimationFrame(raf);
  }, [pct]);

  useEffect(() => {
    if (!lenis) return;
    if (visible) lenis.stop();
    else lenis.start();
  }, [lenis, visible]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-60 flex items-end justify-between bg-blood-800 px-6 pb-8 sm:px-10 sm:pb-10"
          initial={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: reduced ? DURATION.fast : DURATION.slow, ease: EASE }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.78 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.slow, ease: EASE }}
          >
            <SceneImage
              src="/scene/logo.svg"
              loading="eager"
              className="crest-breathe h-[26vh] max-h-55 w-auto opacity-90"
            />
          </motion.div>

          <span className="font-mono text-[10px] tracking-[0.32em] text-rose-200 uppercase">
            Silent Blade Society
          </span>
          <motion.span className="font-mono text-[clamp(3rem,14vw,9rem)] leading-none font-semibold tabular-nums">
            {label}
          </motion.span>

          <div className="absolute inset-x-0 bottom-0 h-px bg-paper-50/20">
            {/* scaleX, not width — nothing here triggers layout. */}
            <motion.div className="h-full origin-left bg-paper-50" style={{ scaleX }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

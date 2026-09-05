"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { DISTANCE, DURATION, EASE, STAGGER } from "@/lib/motion";

export function PageOverlay({
  ready,
  onOpenCollection,
}: {
  ready: boolean;
  onOpenCollection: () => void;
}) {
  const reduced = useReducedMotion();

  const group: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: STAGGER, delayChildren: 0.1 } },
  };

  const item: Variants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: DURATION.fast } } }
    : {
        hidden: { opacity: 0, y: DISTANCE },
        show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
      };

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-40"
      variants={group}
      initial="hidden"
      animate={ready ? "show" : "hidden"}
    >
      <motion.header variants={item} className="absolute top-6 left-6 sm:top-10 sm:left-10">
        <h1 className="font-mono text-[11px] tracking-[0.32em] text-paper-50 uppercase sm:text-xs">
          Silent Blade Society
        </h1>
        <p className="mt-2 max-w-[24ch] font-mono text-[10px] tracking-[0.18em] text-rose-200/70 uppercase">
          A study in motion
        </p>
      </motion.header>

      <motion.div
        variants={item}
        className="pointer-events-auto absolute right-6 bottom-6 sm:right-10 sm:bottom-10"
      >
        <Button onClick={onOpenCollection} aria-haspopup="dialog">
          Collection
          <ButtonArrow />
        </Button>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SceneImage } from "@/components/ui/SceneImage";
import { COLLECTION } from "@/lib/collection";
import type { Piece } from "@/lib/collection";
import { DURATION, EASE } from "@/lib/motion";

const CARD_STAGGER = 0.022;

export function Collection({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [active, setActive] = useState(COLLECTION[0].id);
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  const group = COLLECTION.find((g) => g.id === active) ?? COLLECTION[0];

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [lenis, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const panel: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: DURATION.fast } },
        out: { opacity: 0, transition: { duration: DURATION.fast } },
      }
    : {
        hidden: { y: "100%" },
        show: { y: 0, transition: { duration: DURATION.slow, ease: EASE } },
        out: { y: "100%", transition: { duration: DURATION.base, ease: EASE } },
      };
  const grid: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : CARD_STAGGER } },
    out: { opacity: 0, transition: { duration: 0.18 } },
  };

  const card: Variants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: DURATION.fast } } }
    : {
        hidden: { opacity: 0, y: 14, scale: 0.96 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATION.base, ease: EASE } },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Collection"
          className="fixed inset-0 z-50 flex flex-col bg-blood-950"
          variants={panel}
          initial="hidden"
          animate="show"
          exit="out"
        >
          <div
            className="texture pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
            style={{ backgroundImage: "url(/bg/wall.webp)" }}
          />

          <header className="relative flex items-start justify-between gap-4 px-6 pt-6 sm:px-10 sm:pt-10">
            <div>
              <h2 className="font-mono text-[11px] tracking-[0.32em] text-paper-50 uppercase sm:text-xs">
                The Collection
              </h2>
              <p className="mt-2 max-w-[46ch] font-mono text-[10px] leading-relaxed tracking-[0.14em] text-rose-200/70 uppercase">
                {group.blurb}
              </p>
            </div>
            <Button ref={closeRef} variant="ghost" onClick={onClose}>
              Close
            </Button>
          </header>

          <nav
            aria-label="Collection categories"
            className="relative mt-6 flex gap-1 overflow-x-auto px-6 sm:mt-8 sm:px-10"
          >
            {COLLECTION.map((g) => {
              const selected = g.id === active;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActive(g.id)}
                  aria-current={selected ? "true" : undefined}
                  className={`relative shrink-0 px-4 py-3 font-mono text-[11px] tracking-[0.2em] uppercase
                    transition-colors duration-(--duration-fast) ease-brand
                    ${selected ? "text-paper-50" : "text-paper-50/45 hover:text-paper-50/80"}`}
                >
                  {g.label}
                  <span className="ml-2 text-[9px] text-paper-50/35">{g.pieces.length}</span>
                  {selected && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute inset-x-2 bottom-0 h-px bg-paper-50"
                      transition={
                        reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }
                      }
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="h-px bg-paper-50/15" />

          <div
            data-lenis-prevent
            className="relative flex-1 overflow-y-auto overscroll-contain px-6 py-8 sm:px-10"
          >
            <AnimatePresence mode="wait">
              <motion.ul
                key={group.id}
                variants={grid}
                initial="hidden"
                animate="show"
                exit="out"
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
              >
                {group.pieces.map((piece) => (
                  <Card key={piece.src} piece={piece} variants={card} />
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Card({ piece, variants }: { piece: Piece; variants: Variants }) {
  return (
    <motion.li variants={variants} className="group">
      <div
        className={`flex aspect-square items-center justify-center rounded-lg border p-5
          transition-[transform,border-color] duration-(--duration-fast) ease-brand
          group-hover:-translate-y-1 motion-reduce:transform-none
          ${
            piece.tone === "dark"
              ? "border-paper-50/10 bg-ink-950 group-hover:border-paper-50/40"
              : "border-transparent bg-paper-100 group-hover:border-paper-50/60"
          }`}
      >
        <SceneImage
          src={piece.src}
          className="max-h-full w-auto max-w-full object-contain
                     transition-transform duration-(--duration-base) ease-brand
                     group-hover:scale-[1.06] motion-reduce:transform-none"
        />
      </div>
      <p className="mt-2 truncate font-mono text-[10px] tracking-[0.16em] text-paper-50/55 uppercase">
        {piece.name}
      </p>
    </motion.li>
  );
}

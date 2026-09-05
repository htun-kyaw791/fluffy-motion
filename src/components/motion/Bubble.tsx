"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { DURATION, EASE, SWELL } from "@/lib/motion";

const LENS_MAP = "/scene/lensmap.png";

export function Bubble({
  children,
  lens = 0.7,
  bulge = 0.075,
  origin = "center",
  className = "",
  style,
}: {
  children: ReactNode;
  lens?: number;
  bulge?: number;
  origin?: "center" | "bottom";
  className?: string;
  style?: CSSProperties;
}) {
  const reduced = useReducedMotion();

  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [hovered, setHovered] = useState(false);

  const id = `lens-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const mapRef = useRef<SVGFEImageElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const sx = useSpring(px, SWELL.x);
  const sy = useSpring(py, SWELL.y);
  const depth = useMotionValue(0);

  const d = box ? lens * Math.max(box.w, box.h) : 0;

  const paint = () => {
    mapRef.current?.setAttribute("x", String(sx.get() - d / 2));
    mapRef.current?.setAttribute("y", String(sy.get() - d / 2));
    dispRef.current?.setAttribute("scale", String(depth.get() * bulge * d));
  };
  useMotionValueEvent(sx, "change", paint);
  useMotionValueEvent(sy, "change", paint);
  useMotionValueEvent(depth, "change", paint);

  useEffect(() => {
    if (!box) return;
    const controls = animate(depth, hovered ? 1 : 0, { type: "spring", ...SWELL.y });
    void controls.then(() => {
      if (!hovered) setBox(null);
    });
    return () => controls.stop();
  }, [hovered, box, depth]);

  const enter = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.jump(e.nativeEvent.offsetX);
    py.jump(e.nativeEvent.offsetY);
    setBox({ w: r.width, h: r.height });
    setHovered(true);
  };

  const move = (e: PointerEvent<HTMLDivElement>) => {
    px.set(e.nativeEvent.offsetX);
    py.set(e.nativeEvent.offsetY);
  };

  return (
    <motion.div
      className={`pointer-events-auto ${className}`}
      style={{
        transformOrigin: origin === "bottom" ? "50% 100%" : "50% 50%",
        filter: box ? `url(#${id})` : undefined,
        ...style,
      }}
      whileHover={reduced ? { scaleX: 1.03, scaleY: 1.03 } : undefined}
      transition={{ duration: DURATION.fast, ease: EASE }}
    >
      {children}

      {box && (
        <svg width="0" height="0" aria-hidden className="absolute">
          <defs>
            <filter
              id={id}
              x="-25%"
              y="-25%"
              width="150%"
              height="150%"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodColor="rgb(128,128,128)" result="flat" />
              <feImage
                ref={mapRef}
                href={LENS_MAP}
                x={-d}
                y={-d}
                width={d}
                height={d}
                result="bump"
              />
              <feComposite in="bump" in2="flat" operator="over" result="map" />
              <feDisplacementMap
                ref={dispRef}
                in="SourceGraphic"
                in2="map"
                scale={0}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}
      <div
        className="absolute inset-0"
        onPointerEnter={enter}
        onPointerMove={move}
        onPointerLeave={() => setHovered(false)}
      />
    </motion.div>
  );
}

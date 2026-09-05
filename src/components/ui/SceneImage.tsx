"use client";

import { motion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import type { CSSProperties } from "react";

const DECORATIVE = {
  "aria-hidden": true,
  draggable: false,
  loading: "lazy",
  decoding: "async",
} as const;

export function SceneImage({
  src,
  className = "",
  style,
  loading = "lazy",
}: {
  src: string;
  className?: string;
  style?: CSSProperties;
  loading?: "lazy" | "eager";
}) {
  return (
    /* next/image cannot optimise SVG — it passes the file straight through, and
       refuses to serve it at all without dangerouslyAllowSVG. The wrapper would
       buy zero bytes here while adding a fetch indirection and a width/height
       contract that vh-sized scene art does not fit. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      {...DECORATIVE}
      src={src}
      loading={loading}
      className={`select-none ${className}`}
      style={style}
    />
  );
}

export function MotionSceneImage({
  className = "",
  ...rest
}: Omit<HTMLMotionProps<"img">, "alt">) {
  return (
    <motion.img alt="" {...DECORATIVE} className={`select-none ${className}`} {...rest} />
  );
}

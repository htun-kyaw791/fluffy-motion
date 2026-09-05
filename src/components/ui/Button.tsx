"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";

export function Button({
  children,
  variant = "solid",
  className = "",
  ...rest
}: Omit<ComponentPropsWithRef<"button">, "children"> & {
  children: ReactNode;
  variant?: "solid" | "ghost";
}) {
  const base =
    "group inline-flex items-center gap-3 rounded-full border font-mono text-[11px] " +
    "uppercase tracking-[0.22em] transition-[transform,background-color,color,border-color] " +
    "duration-[var(--duration-fast)] ease-brand " +
    "hover:-translate-y-0.5 active:translate-y-0 " +
    "motion-reduce:transform-none motion-reduce:transition-none";

  const skin =
    variant === "solid"
      ? "border-paper-50/70 bg-paper-50/10 px-6 py-3 text-paper-50 " +
        "backdrop-blur-sm hover:bg-paper-50 hover:text-blood-900"
      : "border-paper-50/25 bg-transparent px-5 py-2.5 text-paper-50/70 " +
        "hover:border-paper-50/70 hover:text-paper-50";

  return (
    <button type="button" className={`${base} ${skin} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonArrow() {
  return (
    <span
      aria-hidden
      className="transition-transform duration-(--duration-fast) ease-brand
                 group-hover:translate-x-1 motion-reduce:transform-none"
    >
      →
    </span>
  );
}

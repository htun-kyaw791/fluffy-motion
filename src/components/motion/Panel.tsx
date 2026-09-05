"use client";

import type { ReactNode } from "react";

// One full-viewport slide of the track. Layout only
export function Panel({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`track-panel relative flex flex-col justify-center ${className}`}>
      {children}
    </section>
  );
}

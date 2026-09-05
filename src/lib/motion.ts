export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 1.0,
} as const;

export const STAGGER = 0.08;

export const DISTANCE = 24;

export const SWELL = {
  x: { stiffness: 260, damping: 12, mass: 0.6 },
  y: { stiffness: 190, damping: 9, mass: 0.6 },
} as const;

export const FLOAT = { stiffness: 52, damping: 11, mass: 0.9 } as const;

export function ramp(p: number, a: number, b: number): number {
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}

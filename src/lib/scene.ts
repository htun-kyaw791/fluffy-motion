function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export const u = (n: number) => `calc(${n} * var(--u))`;

export const ASPECT = {
  grass: 12.093,
} as const;

export const HORIZON = "var(--horizon)";

export type Depth = number;

export type Cloud = {
  src: string;
  x: number;
  y: number;
  h: number;
  drift: number;
  sink: number;
};


export const DEPTH = {
  sun: 0.08,
  clouds: 0.16,
  far: 0.45,
  near: 0.7,
  stance: 1.05,
  grass: 1.32,
  grassMid: 1.5,
  grassNear: 1.75,
} as const satisfies Record<string, Depth>;

export type Placed = {
  src: string;
  scene: number;
  t: number;
  h: number;
  flip?: boolean;
};

export function layerTravel(depth: Depth, panels: number): number {
  return (panels - 1) * 100 * depth;
}

function placedX(depth: Depth, panels: number, scene: number, t: number): number {
  return (layerTravel(depth, panels) * scene) / (panels - 1) + t * 100;
}

export function zoneX(depth: Depth, panels: number, scene: number, t: number): number {
  return (placedX(depth, panels, scene, t) / (100 + layerTravel(depth, panels))) * 100;
}

export const FAR_BUILDINGS: Placed[] = [
  { src: "/scene/houses/house-06.webp", scene: 0, t: 0.08, h: 30 },
  { src: "/scene/pagoda.svg", scene: 0, t: 0.44, h: 34 },
  { src: "/scene/houses/house-15.webp", scene: 0, t: 0.79, h: 26 },

  { src: "/scene/tower.svg", scene: 1, t: 0.13, h: 32 },
  { src: "/scene/houses/house-09.webp", scene: 1, t: 0.5, h: 28 },
  { src: "/scene/houses/house-20.webp", scene: 1, t: 0.86, h: 24 },

  { src: "/scene/houses/house-10.webp", scene: 2, t: 0.1, h: 27 },
  { src: "/scene/houses/house-19.webp", scene: 2, t: 0.47, h: 22 },
  { src: "/scene/pagoda.svg", scene: 2, t: 0.83, h: 31, flip: true },
];

export const NEAR_BUILDINGS: Placed[] = [
  { src: "/scene/houses/house-01.webp", scene: 0, t: 0.19, h: 20 },
  { src: "/scene/torii.svg", scene: 0, t: 0.63, h: 16 },
  { src: "/scene/houses/house-04.webp", scene: 0, t: 0.89, h: 14 },

  { src: "/scene/houses/house-05.webp", scene: 1, t: 0.05, h: 17 },
  { src: "/scene/temple.svg", scene: 1, t: 0.37, h: 24 },
  { src: "/scene/houses/house-16.webp", scene: 1, t: 0.73, h: 19 },

  { src: "/scene/houses/house-03.webp", scene: 2, t: 0.11, h: 22 },
  { src: "/scene/houses/house-17.webp", scene: 2, t: 0.47, h: 18 },
  { src: "/scene/torii.svg", scene: 2, t: 0.79, h: 15, flip: true },
  { src: "/scene/houses/house-22.webp", scene: 2, t: 0.96, h: 16 },
];

export const CLOUDS: Cloud[] = [
  { src: "/scene/cloud-04.svg", x: 2, y: 7, h: 9, drift: -7.5, sink: 15 },
  { src: "/scene/cloud-07.svg", x: 11, y: 19, h: 3, drift: -2.4, sink: 7 },
  { src: "/scene/cloud-02.svg", x: 19, y: 4, h: 7, drift: -5.8, sink: 13 },
  { src: "/scene/cloud-11.svg", x: 26, y: 27, h: 4, drift: -3.1, sink: 9 },
  { src: "/scene/cloud-08.svg", x: 33, y: 12, h: 8, drift: -6.6, sink: 14 },
  { src: "/scene/cloud-14.svg", x: 40, y: 24, h: 4, drift: -2.9, sink: 8 },
  { src: "/scene/cloud-06.svg", x: 47, y: 6, h: 7, drift: -5.2, sink: 12 },
  { src: "/scene/cloud-12.svg", x: 54, y: 30, h: 4, drift: -3.4, sink: 10 },
  { src: "/scene/cloud-02.svg", x: 60, y: 15, h: 6, drift: -4.7, sink: 11 },
  { src: "/scene/cloud-07.svg", x: 67, y: 3, h: 5, drift: -6.1, sink: 13 },
  { src: "/scene/cloud-11.svg", x: 73, y: 22, h: 3, drift: -2.2, sink: 7 },
  { src: "/scene/cloud-04.svg", x: 79, y: 9, h: 8, drift: -6.9, sink: 14 },
  { src: "/scene/cloud-14.svg", x: 85, y: 28, h: 4, drift: -3.6, sink: 9 },
  { src: "/scene/cloud-08.svg", x: 91, y: 17, h: 7, drift: -5.5, sink: 12 },
  { src: "/scene/cloud-06.svg", x: 96, y: 5, h: 6, drift: -4.2, sink: 11 },
  { src: "/scene/cloud-12.svg", x: 15, y: 33, h: 3, drift: -2.6, sink: 6 },
  { src: "/scene/cloud-02.svg", x: 44, y: 34, h: 3, drift: -2.8, sink: 6 },
  { src: "/scene/cloud-06.svg", x: 88, y: 36, h: 3, drift: -2.5, sink: 5 },
];

export type Phase = {
  at: number;
  sky: string;
  ground: string;
  tint: string;
  texture: number;
  vignette: number;
  cloud: number;
};

export const PHASES: Phase[] = [
  {
    at: 0,
    sky: "from-day-300 via-day-200 to-day-100",
    ground: "from-land-400 to-land-600",
    tint: "brightness(1) saturate(1)",
    texture: 0.1,
    vignette: 0.12,
    cloud: 0.62,
  },
  {
    at: 0.5,
    sky: "from-blood-900 via-vermilion-500 to-dusk-500",
    ground: "from-earth-700 to-earth-900",
    tint: "brightness(0.78) saturate(1.2)",
    texture: 0.34,
    vignette: 0.5,
    cloud: 0.34,
  },
  {
    at: 1,
    sky: "from-night-900 via-night-800 to-blood-950",
    ground: "from-ink-950 to-night-900",
    tint: "brightness(0.42) saturate(0.7)",
    texture: 0.4,
    vignette: 0.62,
    cloud: 0.26,
  },
];

export type Stance = {
  scene: number;
  t: number;
  h: number;
  aspect: number;
  frames: string[];
};

export function centerAt(depth: Depth, panels: number, scene: number, t: number): number {
  return (placedX(depth, panels, scene, t) - 50) / layerTravel(depth, panels);
}

export function stanceWindow(
  depth: Depth,
  panels: number,
  scene: number,
  t: number,
): { from: number; to: number } {
  const travel = layerTravel(depth, panels);
  const x = placedX(depth, panels, scene, t);
  return {
    from: Math.max(0, (x - 100) / travel),
    to: Math.min(1, (x - 50) / travel),
  };
}

export function beats(panels: number): number[] {
  if (panels < 2) return [0];
  return Array.from({ length: panels }, (_, i) => i / (panels - 1));
}

export const LEAVES: string[] = Array.from(
  { length: 12 },
  (_, i) => `/figures/leaves/leaf-${String(i + 1).padStart(2, "0")}.svg`,
);

export type Leaf = {
  x: number;
  y: number;
  h: number;
  rot: number;
  flip: boolean;
  opacity: number;
  src: string;
};

export function leafScatter(
  seed: number,
  count: number,
  hMin: number,
  hMax: number,
): Leaf[] {
  const rand = rng(seed);
  const slot = 100 / count;
  return Array.from({ length: count }, (_, i) => ({
    x: i * slot + rand() * slot * 0.8,
    y: rand(),
    h: hMin + rand() * (hMax - hMin),
    rot: rand() * 360,
    flip: rand() < 0.5,
    opacity: 0.55 + rand() * 0.45,
    src: LEAVES[Math.floor(rand() * LEAVES.length)],
  }));
}

export function jitter(a: number, b: number): number {
  return rng((Math.imul(a + 1, 1664525) ^ Math.imul(b + 1, 1013904223)) >>> 0)();
}

export const SUN = {
  left: 62,
  top: 8,
  h: 26,
  arc: { dx: -10, dy: 55 },
  fade: { from: 0.5, to: 0.78 },
  warm: { from: 0.12, to: 0.46 },
} as const;

export const MOON = {
  left: 58,
  top: 13,
  h: 22,
  drop: 48,
  enter: { from: 0.58, to: 1 },
} as const;


export type Relic = {
  src: string;
  dx: number;
  dy: number;
  h: number;
  spin: number;
  delay: number;
  drift: number;
  driftDelay: number;
  amp: number;
};

export const RELIC_WINDOW = { from: 0.6, to: 1.0 } as const;

export const RELIC_SPAN = 0.16;

export const RELICS: Relic[] = [
  { src: "/figures/relics/relic-13.webp", dx: -40, dy: -8, h: 7, spin: -18, delay: 0, drift: 9.4, driftDelay: -2.1, amp: 1.0 },
  { src: "/figures/relics/relic-04.webp", dx: 10, dy: -12, h: 10, spin: -10, delay: 0.06, drift: 12.7, driftDelay: -5.3, amp: 0.75 },
  { src: "/figures/relics/relic-02.webp", dx: -26, dy: 12, h: 9, spin: 24, delay: 0.1, drift: 7.3, driftDelay: -1.4, amp: 1.15 },
  { src: "/figures/relics/relic-16.webp", dx: 26, dy: 6, h: 7.5, spin: 40, delay: 0.16, drift: 11.1, driftDelay: -7.8, amp: 1.3 },
  { src: "/figures/relics/relic-03.webp", dx: 22, dy: -16, h: 8, spin: 16, delay: 0.2, drift: 8.1, driftDelay: -3.6, amp: 0.9 },
  { src: "/figures/relics/relic-08.webp", dx: -46, dy: 28, h: 8, spin: -32, delay: 0.24, drift: 13.1, driftDelay: -0.9, amp: 1.2 },
  { src: "/figures/relics/relic-09.webp", dx: 18, dy: 30, h: 8, spin: -8, delay: 0.3, drift: 6.8, driftDelay: -4.7, amp: 0.7 },
  { src: "/figures/relics/relic-11.webp", dx: -14, dy: 36, h: 11, spin: 12, delay: 0.36, drift: 10.2, driftDelay: -6.2, amp: 0.95 },
  { src: "/figures/relics/relic-10.webp", dx: 2, dy: 52, h: 12, spin: -20, delay: 0.42, drift: 8.7, driftDelay: -2.8, amp: 0.8 },
  { src: "/figures/relics/relic-01.webp", dx: -34, dy: 46, h: 22, spin: -62, delay: 0.46, drift: 11.6, driftDelay: -9.1, amp: 0.6 },
  { src: "/figures/relics/relic-14.webp", dx: 30, dy: 42, h: 9, spin: 28, delay: 0.5, drift: 9.9, driftDelay: -5.9, amp: 1.05 },
];

export const RELIC_DELAY_MAX = Math.max(...RELICS.map((r) => r.delay));

export const STANCES: Stance[] = [
  {
    scene: 0,
    t: 0.5,
    h: 30,
    aspect: 1.15,
    frames: [
      "/figures/fighter/nf-51.svg",
      "/figures/fighter/nf-59.svg",
      "/figures/fighter/nf-72.svg",
      "/figures/fighter/nf-265.svg",
      "/figures/fighter/nf-277.svg",
      "/figures/fighter/nf-285.svg",
      "/figures/fighter/nf-308.svg",
      "/figures/fighter/nf-334.svg",
      "/figures/fighter/nf-389.svg",
      "/figures/fighter/nf-444.svg",
      "/figures/fighter/nf-472.svg",
      "/figures/fighter/nf-491.svg",
      "/figures/fighter/nf-576.svg",
      "/figures/fighter/nf-642.svg",
      "/figures/fighter/nf-676.svg",
    ],
  },
  {
    scene: 1,
    t: 0.5,
    h: 34,
    aspect: 0.8706,
    frames: Array.from(
      { length: 12 },
      (_, i) => `/figures/samurai/sm-${String(i + 1).padStart(2, "0")}.svg`,
    ),
  },
];

export type Vanisher = {
  ninja: string;
  smoke: string;
  scene: number;
  t: number;
  h: number;
  logH: number;
  flip?: boolean;
};

export const VANISHERS: Vanisher[] = [
  { ninja: "/figures/ninja-01.svg", smoke: "/scene/smoke-08.svg", scene: 0, t: 0.4, h: 11, logH: 7.5 },
  { ninja: "/figures/ninja-05.svg", smoke: "/scene/smoke-20.svg", scene: 1, t: 0.2, h: 8, logH: 5.6, flip: true },
  { ninja: "/figures/ninja-07.svg", smoke: "/scene/smoke-15.svg", scene: 1, t: 0.56, h: 10, logH: 7 },
  { ninja: "/figures/ninja-05.svg", smoke: "/scene/smoke-06.svg", scene: 2, t: 0.29, h: 9, logH: 6.3 },
  { ninja: "/figures/ninja-09.svg", smoke: "/scene/smoke-08.svg", scene: 2, t: 0.64, h: 11.5, logH: 8, flip: true },
];

export type Lane = {
  gait: 1 | 2 | 3;
  h: number;
  bottom: number;
  crossSeconds: number;
  cycles: number;
  offset: number;
  opacity: number;
};

export const LANES: Lane[] = [
  { gait: 1, h: 5.5, bottom: 0.7, crossSeconds: 13, cycles: 47, offset: 0.3, opacity: 0.8 },
  { gait: 2, h: 7, bottom: 0.625, crossSeconds: 5, cycles: 25, offset: 0.52, opacity: 0.88 },
  { gait: 1, h: 9.5, bottom: 0.55, crossSeconds: 10.5, cycles: 45, offset: 0.18, opacity: 0.95 },
  { gait: 3, h: 12, bottom: 0.45, crossSeconds: 3.3, cycles: 21, offset: 0.68, opacity: 1 },
];

export type Clump = { x: number; w: number };

export function grassClumps(
  seed: number,
  count: number,
  wMin: number,
  wMax: number,
): Clump[] {
  const rand = rng(seed);
  const slot = 100 / count;
  return Array.from({ length: count }, (_, i) => ({
    x: i * slot + rand() * slot * 0.5,
    w: wMin + rand() * (wMax - wMin),
  }));
}

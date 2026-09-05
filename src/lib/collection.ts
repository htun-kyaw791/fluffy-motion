import {
  CLOUDS,
  FAR_BUILDINGS,
  LEAVES,
  NEAR_BUILDINGS,
  RELICS,
  STANCES,
  VANISHERS,
} from "./scene";

type Tone = "light" | "dark";

export type Piece = {
  src: string;
  name: string;
  tone: Tone;
};

type Group = {
  id: string;
  label: string;
  blurb: string;
  pieces: Piece[];
};

/** "/scene/houses/house-06.webp" -> "House 06" */
function prettify(src: string): string {
  const base = src.split("/").pop()!.replace(/\.\w+$/, "");
  return base.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function numbered(srcs: string[], label: string, tone: Tone = "light"): Piece[] {
  return srcs.map((src, i) => ({
    src,
    name: `${label} ${String(i + 1).padStart(2, "0")}`,
    tone,
  }));
}

function named(srcs: string[], tone: Tone = "light"): Piece[] {
  return srcs.map((src) => ({ src, name: prettify(src), tone }));
}

function unique(srcs: string[]): string[] {
  return Array.from(new Set(srcs));
}

const RUNNER_PIECES: Piece[] = ([1, 2, 3] as const).flatMap((g) =>
  [1, 2, 3, 4].map((f) => ({
    src: `/figures/dog/dog-${g}-0${f}.svg`,
    name: `Gait ${g} · Frame ${f}`,
    tone: "light" as const,
  })),
);

export const COLLECTION: Group[] = [
  {
    id: "stances",
    label: "Stances",
    blurb:
      "Held poses, stepped rather than tweened — the figures snap between them as you scroll.",
    pieces: [
      ...numbered(STANCES[0].frames, "Stance"),
      ...numbered(STANCES[1].frames, "Kata"),
    ],
  },
  {
    id: "runners",
    label: "Runners",
    blurb:
      "Three four-frame gait cycles. A walk, a trot, and a full gallop, stepped by CSS at 0 / 25 / 50 / 75%.",
    pieces: RUNNER_PIECES,
  },
  {
    id: "structures",
    label: "Structures",
    blurb: "The skyline, split across two depth planes so the ranks part as you travel.",
    pieces: named(unique([...FAR_BUILDINGS, ...NEAR_BUILDINGS].map((b) => b.src))),
  },
  {
    id: "relics",
    label: "Relics",
    blurb:
      "Thrown out of the sun in the last scene. These are the pieces you can pick up and drag.",
    pieces: named(RELICS.map((r) => r.src)),
  },
  {
    id: "elements",
    label: "Elements",
    blurb:
      "Sky, smoke and ground cover — the parts of the world that are weather rather than object.",
    pieces: [
      { src: "/scene/sun.svg", name: "Sun", tone: "light" },
      ...named(CLOUDS.map((c) => c.src), "dark"),
      ...named(unique(VANISHERS.map((v) => v.ninja))),
      ...named(unique(VANISHERS.map((v) => v.smoke)), "dark"),
      { src: "/scene/wood.svg", name: "Log", tone: "light" },
      { src: "/scene/grass.svg", name: "Grass", tone: "light" },
      ...named(LEAVES),
    ],
  },
];

"use client";

import { Bubble } from "@/components/motion/Bubble";
import { GaitRunner } from "@/components/motion/GaitRunner";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { GrassBand, LeafLitter } from "@/components/scene/Ground";
import { Kawarimi } from "@/components/scene/Kawarimi";
import { Relics } from "@/components/scene/Relics";
import { StanceFigure } from "@/components/scene/StanceFigure";
import { Structures } from "@/components/scene/Structures";
import { SceneImage } from "@/components/ui/SceneImage";
import {
  CLOUDS,
  DEPTH,
  FAR_BUILDINGS,
  HORIZON,
  LANES,
  NEAR_BUILDINGS,
  STANCES,
  SUN,
  VANISHERS,
  grassClumps,
  leafScatter,
  u,
} from "@/lib/scene";

const FAR_CLUMPS = grassClumps(11, 17, 8, 17);
const MID_CLUMPS = grassClumps(29, 14, 12, 25);
const NEAR_CLUMPS = grassClumps(47, 12, 18, 33);

const FAR_LEAVES = leafScatter(37, 88, 0.9, 1.8);
const MID_LEAVES = leafScatter(83, 72, 1.6, 3.2);
const NEAR_LEAVES = leafScatter(151, 52, 2.6, 5);

const WIND = { far: 2, mid: 4.5, near: 8 };

const FOOT_LEAVES = [leafScatter(211, 8, 1.3, 2.5), leafScatter(307, 8, 1.3, 2.5)];

export function Scene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-blood-950 via-blood-800 to-blood-700" />
      <div
        className="texture absolute inset-0 opacity-40 mix-blend-multiply"
        style={{ backgroundImage: "url(/bg/wall.webp)" }}
      />

      <ParallaxLayer depth={DEPTH.sun}>
        <Bubble
          lens={0.8}
          className="absolute opacity-70"
          style={{ left: `${SUN.left}%`, top: `${SUN.top}vh`, height: u(SUN.h) }}
        >
          <SceneImage src="/scene/sun.svg" loading="eager" className="h-full w-auto max-w-none" />
        </Bubble>
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTH.clouds}>
        {CLOUDS.map((c, i) => (
          <Bubble
            key={i}
            lens={0.95}
            bulge={0.1}
            className="absolute opacity-20"
            style={{ left: `${c.x}%`, top: `${c.y}vh`, height: u(c.h) }}
          >
            <SceneImage src={c.src} className="h-full w-auto max-w-none" />
          </Bubble>
        ))}
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTH.far} band={{ bottom: HORIZON, height: "42vh" }}>
        <Structures items={FAR_BUILDINGS} depth={DEPTH.far} opacity={0.58} />
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTH.near} band={{ bottom: HORIZON, height: "30vh" }}>
        <Structures items={NEAR_BUILDINGS} depth={DEPTH.near} opacity={1} />
        {VANISHERS.map((v, i) => (
          <Kawarimi key={i} v={v} depth={DEPTH.near} />
        ))}
      </ParallaxLayer>

      <div
        className="absolute inset-x-0 bottom-0 bg-linear-to-b from-earth-700 to-earth-900"
        style={{ height: HORIZON }}
      />

      <ParallaxLayer
        depth={DEPTH.grass}
        band={{ bottom: `calc(${HORIZON} * 0.5)`, height: `calc(${HORIZON} * 0.45)` }}
      >
        <LeafLitter leaves={FAR_LEAVES} wind={WIND.far} />
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTH.grass} band={{ bottom: `calc(${HORIZON} - 2vh)`, height: u(4) }}>
        <GrassBand heightVh={4} clumps={FAR_CLUMPS} />
      </ParallaxLayer>

      <div className="absolute inset-x-0 bottom-0" style={{ height: `calc(${HORIZON} * 1.7)` }}>
        {LANES.map((lane, i) => (
          <GaitRunner key={i} {...lane} />
        ))}
      </div>

      <ParallaxLayer
        depth={DEPTH.stance}
        band={{ bottom: `calc(${HORIZON} - 9vh)`, height: "34vh" }}
      >
        {STANCES.map((st, i) => (
          <StanceFigure
            key={st.frames[0]}
            stance={st}
            litter={FOOT_LEAVES[i % FOOT_LEAVES.length]}
          />
        ))}
      </ParallaxLayer>

      <ParallaxLayer
        depth={DEPTH.grassMid}
        band={{ bottom: `calc(${HORIZON} * 0.06)`, height: `calc(${HORIZON} * 0.5)` }}
      >
        <LeafLitter leaves={MID_LEAVES} wind={WIND.mid} />
      </ParallaxLayer>

      <ParallaxLayer
        depth={DEPTH.grassMid}
        band={{ bottom: `calc(${HORIZON} * 0.35)`, height: u(6) }}
      >
        <GrassBand heightVh={6} clumps={MID_CLUMPS} />
      </ParallaxLayer>

      <ParallaxLayer
        depth={DEPTH.grassNear}
        band={{ bottom: "0vh", height: `calc(${HORIZON} * 0.4)` }}
      >
        <LeafLitter leaves={NEAR_LEAVES} wind={WIND.near} />
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTH.grassNear} band={{ bottom: "0vh", height: u(8) }}>
        <GrassBand heightVh={8} clumps={NEAR_CLUMPS} />
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTH.sun}>
        <Relics />
      </ParallaxLayer>

      <div className="absolute inset-0 bg-linear-to-r from-blood-950/60 via-transparent to-blood-950/50" />
    </div>
  );
}

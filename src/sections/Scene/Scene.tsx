"use client";

import { motion } from "motion/react";
import { GaitRunner } from "@/components/motion/GaitRunner";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { PhaseStack, usePhase } from "@/components/motion/PhaseStack";
import { GrassBand, LeafLitter } from "@/components/scene/Ground";
import { Kawarimi } from "@/components/scene/Kawarimi";
import { Relics } from "@/components/scene/Relics";
import { Clouds, Moon, Sun } from "@/components/scene/Sky";
import { StanceFigure } from "@/components/scene/StanceFigure";
import { Structures } from "@/components/scene/Structures";
import {
  DEPTH,
  FAR_BUILDINGS,
  HORIZON,
  LANES,
  NEAR_BUILDINGS,
  STANCES,
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

export function Scene({ ready = true }: { ready?: boolean }) {
  const tint = usePhase((p) => p.tint);
  const texture = usePhase((p) => p.texture);
  const vignette = usePhase((p) => p.vignette);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <PhaseStack pick={(p) => p.sky} className="absolute inset-0 bg-linear-to-b" />

      <motion.div
        aria-hidden
        className="texture absolute inset-0 mix-blend-multiply"
        style={{ backgroundImage: "url(/bg/wall.webp)", opacity: texture }}
      />

      <ParallaxLayer depth={DEPTH.sun}>
        <Sun />
        <Moon />
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTH.clouds}>
        <Clouds />
      </ParallaxLayer>

      <ParallaxLayer
        depth={DEPTH.far}
        band={{ bottom: HORIZON, height: "42vh" }}
        style={{ filter: tint }}
      >
        <Structures items={FAR_BUILDINGS} depth={DEPTH.far} opacity={0.88} />
      </ParallaxLayer>

      <ParallaxLayer
        depth={DEPTH.near}
        band={{ bottom: HORIZON, height: "30vh" }}
        style={{ filter: tint }}
      >
        <Structures items={NEAR_BUILDINGS} depth={DEPTH.near} opacity={1} />
        {VANISHERS.map((v, i) => (
          <Kawarimi key={i} v={v} depth={DEPTH.near} />
        ))}
      </ParallaxLayer>

      <PhaseStack
        pick={(p) => p.ground}
        className="absolute inset-x-0 bottom-0 bg-linear-to-b"
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
            play={ready}
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

      <motion.div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-blood-950 via-transparent to-blood-950"
        style={{ opacity: vignette }}
      />
      
      <ParallaxLayer depth={DEPTH.sun} style={{ filter: "brightness(1.35) saturate(1.1)" }}>
        <Relics />
      </ParallaxLayer>
    </div>
  );
}

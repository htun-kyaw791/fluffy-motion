"use client";

import { useState } from "react";
import { HorizontalTrack } from "@/components/motion/HorizontalTrack";
import { Panel } from "@/components/motion/Panel";
import { PageOverlay } from "@/sections/PageOverlay/PageOverlay";
import { Collection } from "@/sections/Collection/Collection";
import { Preloader } from "@/sections/Preloader/Preloader";
import { Scene } from "@/sections/Scene/Scene";

const PANELS = 3;
const SNAP_SECONDS = 6;
const SNAP_BACK_SECONDS = 1.2;

export default function Page() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />

      <main>
        <HorizontalTrack panels={PANELS} snapSeconds={
          SNAP_SECONDS}
          snapBackSeconds={SNAP_BACK_SECONDS} backdrop={<Scene ready={ready} />}>
          {Array.from({ length: PANELS }, (_, i) => (
            <Panel key={i} />
          ))}
        </HorizontalTrack>
      </main>

      <PageOverlay ready={ready} onOpenCollection={() => setOpen(true)} />
      <Collection open={open} onClose={() => setOpen(false)} />
    </>
  );
}

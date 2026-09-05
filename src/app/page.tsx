"use client";

import { useState } from "react";
import { HorizontalTrack } from "@/components/motion/HorizontalTrack";
import { Panel } from "@/components/motion/Panel";
import { PageOverlay } from "@/sections/PageOverlay/PageOverlay";
import { Collection } from "@/sections/Collection/Collection";
import { Preloader } from "@/sections/Preloader/Preloader";
import { Scene } from "@/sections/Scene/Scene";

const PANELS = 3;

export default function Page() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />

      <main>
        <HorizontalTrack panels={PANELS} backdrop={<Scene />}>
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

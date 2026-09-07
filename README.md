# Silent Blade Society

An animation-heavy landing page for the Rezerv frontend assessment, Part 1.

**Live:** https://fluffy-motion.vercel.app/

Reference: [nft.fluffyhugs.io](https://nft.fluffyhugs.io/). The motion is copied,
the artwork is my own — the brief allows swapping assets.

## Setup

```bash
npm install
npm run dev                      # http://localhost:3000
npm run build && npm run start
npm run lint
```

Node 20+. No environment variables, no backend, no API keys.

`npm run sprites` rebuilds the sprite sheets from their source frames. The output
is committed, so this is only needed if a frame list in `src/lib/scene.ts`
changes. Requires Node 22.6+.

## Slides implemented

The brief's recommended set of three.

| Slide | Code |
| --- | --- |
| Loading screen | `sections/Preloader` |
| Hero | `sections/Scene` + `components/motion/HorizontalTrack` |
| Collection | `sections/Collection` |

The collection opens as a layer over the page, not a route, since the brief rules
out routing.

## Libraries

- **Next.js (App Router) + TypeScript** — one static prerendered page.
- **Tailwind CSS v4** — design tokens as real CSS custom properties, readable by
  both Tailwind classes and hand-written CSS.
- **`motion`** (formerly framer-motion) — `useScroll` and `useTransform`. Scroll
  values update outside React's render cycle, so eight parallax layers can move
  per frame without re-rendering the tree.
- **`lenis`** — smooth scroll.

No GSAP, Locomotive, AOS or UI kit. The page needs one scroll subscription and
some interpolation; GSAP would be a second animation runtime next to `motion`.

## Approach

### Animation

**Horizontal travel.** A tall spacer supplies the scroll budget, a sticky child
pins one viewport, and the panel strip inside translates along X. The page never
scrolls sideways, so wheel, touch, keyboard and scrollbar all keep working.

With N panels the strip is `N × 100vw`, and the last panel is in view after
`(N-1) × 100vw` — as a percentage of the strip's own width, `(N-1)/N`. A
constant, so nothing has to measure anything.

**Parallax.** Eight depth planes share one `scrollYProgress` through
`TrackContext`, so they cannot drift apart. Depths run 0.08 (sun) to 1.75
(foreground grass), with the panels at 1.0.

**Frame sequences.** The running dogs and the two fighters step through frames.
Each sequence is a single sprite sheet moved by a transform: the dogs on a CSS
`steps(4)` animation, the fighters stepped by scroll position.

**Hover.** Three levels. The sun, clouds and relics warp under the cursor via an
SVG `feDisplacementMap` whose bump map follows the pointer. Relics are draggable.
Buttons, tabs and cards use CSS transitions off shared tokens — they have hover
states but go nowhere, per the brief.

**Reduced motion.** `prefers-reduced-motion` unpins the track into a normal
vertical stack. This is done in CSS rather than `useReducedMotion()`, because the
hook returns `false` during SSR and branching layout on it causes a hydration
mismatch.

### Smooth scroll

Lenis smooths the vertical scroll, and the horizontal track reads that progress,
so the sideways motion inherits Lenis's easing without any configuration.

Two places take manual control:

- **Preloader** — `lenis.stop()` while visible, `start()` on exit, so the track
  does not travel behind the loading screen.
- **Collection** — `stop()` to freeze the scene, plus `data-lenis-prevent` on the
  grid. Both are needed: a stopped Lenis still swallows wheel events, so without
  the attribute the panel cannot scroll.

Lenis disables its own smoothing under `prefers-reduced-motion`.

### Responsiveness

Everything is sized in viewport units, so resize needs no JavaScript at all — no
`ResizeObserver`, no resize listener.

Checked in a real browser at 1440×900, 834×1112 and 390×844: no horizontal
overflow, the collection grid steps 2 → 3 → 4 → 6 columns, and the tab strip
scrolls rather than wrapping.

One custom breakpoint: `--horizon` deepens from `20vh` to `38vh` under
`max-aspect-ratio: 4/5`, so it fires on a portrait phone but not on a narrow
desktop window.

## Performance

- Only `transform` and `opacity` animate. The preloader bar is `scaleX`, not
  `width`.
- One scroll subscription for the page. Scroll-linked values are `MotionValue`s
  and bypass React's render cycle.
- The preloader counter is a `MotionValue` too, so React renders the preloader
  twice in total rather than sixty times a second.
- Nothing measures on resize.
- No per-frame JavaScript for the gait, and nothing declares `will-change`.
- Frame sequences are single sprite sheets, so stepping a frame is a transform on
  an image that is already loaded.
- Buildings and clouds lazy-load. `SceneImage` is lazy by default; callers opt in
  to `eager` for what is on screen at load.
- Plain `<img>` rather than `next/image`, which cannot optimise SVG.

`npm run lint` and `npm run build` are both clean.

## Assumptions

- **Three slides, not seven.** The brief asks for any three.
- **Original assets.** Art licensed from Vecteezy and recoloured. The reference's
  NFT artwork is its own IP and the brief permits swapping.
- **The CTA opens an in-page layer** rather than navigating, which satisfies both
  "hover states" and "no working CTAs".
- **The scrollbar is hidden** for a full-bleed scene. The indicator only;
  scrolling itself is untouched.
- **Pinning treated as in scope.** The brief lists parallax and pinning as
  "and/or"; the horizontal track is a pin and carries the parallax with it.
- **Three panels is a content choice, not a limit.** `<HorizontalTrack panels={n}>`
  derives its scroll budget and travel from `n`.

## Known limitations

- The fighter sprite sheet is 145 KB over the wire. The frames are auto-traced
  vectors that have not been through SVGO.
- Static assets use Vercel's default `max-age=0`, so every load revalidates them.
- Relics have no `dragConstraints` and can be dragged out of the scene.
- No focus trap in the collection dialog. Focus moves in on open and Escape
  works, but Tab can walk out behind it.
- No `srcset`, and images carry no intrinsic `width`/`height`.
- Safari is untested. Chrome and Firefox are verified.
- No tests. `zoneX`, `stanceWindow` and `ramp` would be the first targets.

# Silent Blade Society

A single animation-heavy landing page, built for the Rezerv frontend assessment
(**Part 1 — UI Animation Challenge**). Three slides travel **sideways** off an
ordinary vertical scroll, across one continuous parallax world.

**Live:** _<add the deployed URL here>_

Reference: [nft.fluffyhugs.io](https://nft.fluffyhugs.io/) — treated as a
**motion spec, not a design spec**. The brief allows swapping assets, so the
timing and feel are reproduced with original artwork rather than the
reference's licensed NFT work.

## Setup

```bash
npm install
npm run dev                      # http://localhost:3000
npm run build && npm run start   # verify the production bundle
npm run lint
```

Node 20+. No environment variables, no backend, no API keys — the page is
prerendered as static content and everything it needs is in `public/`.

## Which three slides

The brief's recommended set — **loading screen → hero → content/collection**.

| Slide | Section | What it demonstrates |
| --- | --- | --- |
| 1 · Loading screen | `sections/Preloader` | load state, gated counter, masked exit, scroll lock |
| 2 · Hero | `sections/PageOverlay` + `sections/Scene` + `components/motion/HorizontalTrack` | entrance reveal, three panel-widths of horizontal travel over one continuous parallax world |
| 3 · Collection | `sections/Collection` | tabbed catalogue of the scene's own artwork, with a shared-element tab underline and a staggered grid |

The three are **sequenced**, not merely present: the preloader's
`onExitComplete` flips the flag that triggers the hero's entrance reveal, so the
lockup arrives into a scene the reader can already see rather than racing the
loading screen off the stage.

The panels themselves carry no copy — the scene is the subject — but they define
the track's geometry: the scroll budget is one viewport per panel and the strip
translates by `(N-1)/N`.

### The collection is a layer, not a route

The brief is explicit: *"one page only… no routing, no real navigation, no
working CTAs."* So the Collection button opens a full-bleed layer over the
scene rather than navigating. `AnimatePresence` owns its mount, which is what
lets the panel play a real exit on the way out — the thing a route change could
not do without reaching for a transition API.

Scroll is handled twice over, and both halves are load-bearing. `lenis.stop()`
freezes the track underneath so it does not travel while the reader is inside;
`data-lenis-prevent` on the grid's scroller tells Lenis to leave events in that
subtree alone. Without the second, a *stopped* Lenis swallows the wheel and the
panel cannot scroll at all.

Tab changes animate twice over too: the active underline is one element shared
across all five tabs via `layoutId`, so Motion slides it from the old tab to the
new one instead of cross-fading two bars, and the grid re-enters card by card on
a `staggerChildren`. The exit is *not* staggered — at twenty-seven cards, every
tab change would otherwise wait out a second of cards leaving before the next
set could begin.

Card mats are per-piece data rather than one background colour. Almost all the
artwork is the same near-black silhouette and needs a pale mat, but the clouds
and smoke are the cream end of the palette (`#fdf6f2` → `#c08072`) and vanish on
anything light — so `tone` is recorded next to each piece, the same way `ASPECT`
records facts measured off the files.

The catalogue itself is **derived from the scene data**, not typed out twice: a
building added to `NEAR_BUILDINGS` appears in the collection without anyone
remembering to list it, and a piece removed from the scene cannot linger as a
broken image.

## Libraries, and why

Four dependencies. The short list is deliberate.

- **Next.js (App Router) + TypeScript** — a single prerendered page; the
  framework is doing very little here on purpose.
- **Tailwind CSS v4** — CSS-first `@theme`, so design tokens are real custom
  properties that both Tailwind classes and hand-written CSS read from.
- **`motion`** (the former framer-motion, imported from `motion/react`) — for
  `useScroll` / `useTransform`. Scroll-linked `MotionValue`s update outside the
  React render cycle, which is the whole reason to use it: driving eight
  parallax layers through `useState` would re-render the tree on every frame.
- **`lenis`** — smooth scroll, via `lenis/react`.

Deliberately *not* used: GSAP + ScrollTrigger, Locomotive, AOS, or a UI kit. The
page needs one scroll subscription and a handful of interpolations; GSAP would
be a second animation runtime alongside the one already shipping.

## Approach

### Horizontal travel without horizontal scroll

The page never scrolls sideways. A tall spacer supplies the scroll budget, a
sticky child pins one viewport, and the panel strip inside is translated along X
in proportion to progress through the spacer.

Native horizontal scroll — or Lenis in `orientation: 'horizontal'` — would mean
intercepting wheel and touch input. That fights the iOS back-swipe, breaks
keyboard paging and the scrollbar, and takes scroll position out of the
browser's hands. Here every input method keeps working untouched, and **Lenis
needs no configuration**: it is already smoothing the vertical scroll this reads
from, so the horizontal motion inherits that easing for free.

The load-bearing detail is the unit. With N panels each one viewport wide, the
strip is `N × 100vw`, and the last panel is in view once it has moved
`(N-1) × 100vw`. Expressed as a percentage *of the strip's own width* that is
`(N-1)/N` — a constant. The parallax layers use the same trick: a layer at depth
`d` is made `100 + d×(N-1)×100` vw wide and shifted by its own overflow.

> Nothing measures the viewport. There is no `ResizeObserver`, no resize
> listener, and no recalculation — the geometry is correct at every size because
> it is expressed in units that scale with the element.

`position: sticky` is why `globals.css` uses `overflow-x: clip` rather than
`hidden` on `html, body`: `hidden` creates a scroll container and would break
the pin. `clip` does not.

### Parallax

Eight depth planes read **one** shared `scrollYProgress` through
`TrackContext` — one scroll subscription, many consumers, so layers cannot drift
apart under load. The depths live as a table in `lib/scene.ts`:

| plane | depth | | plane | depth |
| --- | --- | --- | --- | --- |
| sun | 0.08 | | stance figures | 1.05 |
| clouds | 0.16 | | horizon grass | 1.32 |
| far buildings | 0.45 | | mid grass | 1.50 |
| near buildings | 0.70 | | foreground grass | 1.75 |

The content panels sit at an implied 1.0 — they are the track itself, so
everything below 1 falls behind them and everything above outruns them.

The runners sit **outside** that stack. Riding the grass layer would carry them
along with the camera and read as stationary; running them across a
viewport-fixed band with the grass sliding underneath at the fastest depth is
what sells the ground speed. The grass renders *after* them so the blades pass
in front of their legs.

### The gait

Four frames sit in a flex strip four times the width of its clipping window; the
strip is stepped across by exactly its own width with `steps(4)`, which samples
at 0 / 25 / 50 / 75% and lands on each frame, never between them. Ground travel
is a *separate* transform on the wrapper, so stride rate and ground speed tune
independently — which is what stops the legs sliding.

Both are CSS animations on `transform` alone: no JS runs per frame. Swapping
`<img src>` per frame would cause decode jank, and animating `background-position`
would hit paint rather than compositing.

### Three scenes

Props are positioned by **scene index plus a 0-1 offset across that scene**, not
by an absolute percentage of the layer — `zoneX` in `lib/scene.ts` converts
between them. A layer's width depends on its depth, so the same percentage
lands somewhere different on every plane; saying "scene 2, 40% across" keeps a
building in scene 2 whichever depth it is assigned.

Each scene gets its own buildings. Sharing one set made the three panels read as
the same view scrolled past twice, which is most of the difference between
"three scenes" and "one long backdrop".

Scroll budget is separate from travel distance: the strip always moves `(N-1)/N`
of its own width, and `scrollPerPanel` (viewport heights per panel) decides how
much scrolling that takes. One viewport per panel put the whole track inside a
single flick of the wheel.

A fighter holds the foreground of the first scene and a samurai the second,
stepping through fifteen and twelve stances respectively as the reader scrolls.
Stepped, not interpolated — the frames are unrelated poses rather than an
animation cycle, so cross-fading two of them would blur one silhouette into
another. Only a three-frame window is mounted: the sets run to hundreds of
kilobytes, and putting all of it in the DOM of a scene that is on screen at load
would pull the lot down before anything else. Keeping the neighbours mounted
means the next stance is decoded before it is needed.

Between the buildings, ninjas substitute themselves away: the figure resolves,
bursts into smoke, and a log drops into its place. Every phase is a
`useTransform` off the same track progress, so the sequence is scrubbed by the
scrollbar rather than played by a timer — it runs forward as its ground comes in
and unwinds if the user scrolls back. All three elements share one anchor, so
the log appears exactly where the puff is.

The fall stops are deliberately uneven — barely moving at first, then covering
most of the distance in the last stretch — because a constant rate reads as a
lift rather than a drop, and a scrubbed timeline has no easing curve to lean on.
The log lands on a corner at 10° and rocks flat, overshooting once; one that
simply straightens looks winched down.

Phase windows are clamped, because a prop near the start of the first scene
centres at a progress below zero and its sequence would be over before the page
could scroll. No two durations share a common factor, so the group drifts
permanently out of phase and never settles into a pattern — the appearance of
randomness with nothing to seed, and nothing that could differ between the
server render and the client one.

### The scene

Everything in the world is sized in `vh` against a single `HORIZON` constant —
the depth of the ground band, whose top edge is the skyline. Buildings stand on
that edge; runners stand on the band itself, with `bottom` measured from its
base so the distant ones sit higher up the band and smaller. An earlier version
measured runner feet from the horizon line instead, which left the small ones
hanging in the sky.

Paint order is the depth order: ground, horizon grass, runners, foreground
grass. Getting that wrong is visible immediately — with the horizon grass
painted after the runners, the distant dogs were cropped off at the waist.

`GrassBand` sidesteps the seam rather than hiding it. The source artwork does
not tile — its left and right edges do not meet — so a plain `repeat-x` leaves a
notch every tile width. Instead each patch is narrower than one tile and uses
`no-repeat`, showing a single contiguous slice, so there is never a join at all;
patches are scattered with open ground between them, and each samples a
*different* slice of the 7000px strip so no two look alike off one asset. Tile
width is derived from the band's height, so the alignment holds at any viewport
size without measuring.

### Hover

The brief asks for interactive elements that respond to mouse-over. There are
three tiers, and they are deliberately different in weight.

**The lens (`components/motion/Bubble`).** The sun, the clouds and the relics
distort under the cursor as if a glass bead were being dragged across them. It
is an SVG filter, not a transform: an `feImage` bump map is positioned at the
pointer and fed to `feDisplacementMap`, so pixels bend around the cursor instead
of the whole element scaling.

Three things keep it cheap:

- The filter is **only attached while hovered**. `filter: url(#…)` is set from
  state on enter and torn back down once the spring has settled, so the rest of
  the page is never rendering through a filter it is not using.
- The pointer position is a `MotionValue` through a spring, and the map's `x`/`y`
  are written with `setAttribute` inside `useMotionValueEvent` — **no React
  render per frame**. The component re-renders twice per hover, not sixty times
  a second.
- Under `prefers-reduced-motion` the whole displacement path is skipped and the
  element takes a 3% scale instead, which is the same affordance without the
  warping.

**Drag.** The relics thrown out of the sun in the last scene are `drag`-enabled
and take a small `whileDrag` scale, with `cursor-grab` / `active:cursor-grabbing`
so the affordance is visible before the press.

**Controls.** Buttons, tabs and collection cards use plain CSS transitions off
the shared `--duration-fast` / `--ease-brand` tokens — a lift and a colour
inversion on the CTA, a scale and border on the cards. All of them carry
`motion-reduce:transform-none`. Per the brief they are clickable and stateful
but navigate nowhere.

### Responsiveness

Because the track and the scene are both unit-based, resize needs no JS at all.

Verified by driving a real browser over CDP at 1440×900, 834×1112 and 390×844:
no horizontal page overflow at any of the three, the collection grid steps
2 → 3 → 4 → 6 columns, and the tab strip becomes a horizontal scroller on
narrow viewports rather than wrapping or truncating.

The one breakpoint that is not a Tailwind class is `--horizon`, which deepens
from `20vh` to `38vh` under `max-aspect-ratio: 4/5`. On a tall phone the shallow
ground band left the whole world crushed into a strip at the bottom of the
screen; the query keys off shape rather than width, so it fires on a portrait
phone and not on a narrow desktop window.

### Reduced motion

`prefers-reduced-motion` **unpins the track into an ordinary vertical stack**
rather than merely shortening the animation — a pinned sideways scroll is
precisely the vestibular trigger the query exists to defuse. Autonomous motion
(gait, ground travel) stops; parallax and scroll-linked reveals resolve to their
end state.

That switch lives in **CSS, not in a `useReducedMotion()` branch**. The hook
returns `false` during SSR and on the first client render before flipping to
`true`, so branching layout on it produces a hydration mismatch — and React does
not patch up mismatched attributes, which meant an earlier version of this
fallback *silently never applied*. Expressing it as a media query means server
and client render identical markup and the browser resolves the difference.

The hook is still used, but only where it changes an animation's *values* rather
than the layout: the preloader's exit, the entrance stagger, the lens.

## Performance notes

- **Only `transform` and `opacity` animate.** No layout-triggering property is
  animated anywhere — the preloader bar is `scaleX`, not `width`.
- **One scroll subscription** for the whole page. Scroll-linked values are
  `MotionValue`s, so they bypass React's render cycle — eight parallax layers
  update per frame without re-rendering a single component.
- **The preloader counter is a `MotionValue` too.** It ticks every frame while
  the overlay is up; as React state that would have been sixty re-renders a
  second at the one moment the main thread is busiest. Motion writes the digits
  and the progress bar's `scaleX` straight to the DOM, so React renders the
  preloader twice in total.
- **Nothing measures on resize.** No `ResizeObserver`, no resize handler.
- **Per-frame JS for the gait: none.** It is a stepped CSS animation. Nothing
  declares `will-change` either — an element running an infinite transform
  animation is promoted anyway, and declaring it pins the layer in memory for
  the life of the page rather than the life of the effect.
- **The hover lens attaches its SVG filter only while hovered** and detaches it
  once the spring settles.
- **Only a three-frame window of each stance set is mounted**, so a scene that is
  on screen at load does not pull down its whole sprite set first.
- **Lazy loading** on the building and cloud planes; `SceneImage` defaults to
  `loading="lazy" decoding="async"` and callers opt *in* to `eager` for the few
  things that are on screen at load.
- Raw `<img>` rather than `next/image`, with the reasoning recorded at the
  `eslint-disable` in `SceneImage`: `next/image` cannot optimise SVG (it passes
  the file through, and refuses to serve it at all without
  `dangerouslyAllowSVG`), so the wrapper would buy zero bytes while adding a
  fetch indirection and a width/height contract that `vh`-sized art does not fit.

`npm run lint` is clean and `npm run build` typechecks with no errors.

## Architecture

```
src/app/                 layout · page · globals.css (theme + track layout)
src/sections/            used once:   Preloader · PageOverlay · Scene · Collection
src/components/motion/   mechanism:   HorizontalTrack · TrackContext · Panel ·
                                      ParallaxLayer · Bubble · GaitRunner
src/components/scene/    world props: Structures · Ground · Kawarimi ·
                                      StanceFigure · Relics
src/components/ui/       Button · SceneImage (+ its motion twin)
src/lib/                 motion.ts (tokens) · scene.ts (depths, composition) ·
                         collection.ts (catalogue, derived from scene.ts)
src/providers/           SmoothScroll.tsx
```

The rule is literal: `sections/` holds the things rendered exactly once,
`components/` holds everything that is mapped over or reused. `motion/` is the
mechanism — it has no opinion about what it is carrying; `scene/` is the world
built on top of it.

`HorizontalTrack` takes its backdrop as a **prop**, not a hard-wired import, so
the track stays a layout primitive: `page.tsx` is the only file that knows the
scene and the panels belong together.

All timing and easing lives in `lib/motion.ts` and is mirrored as custom
properties in `globals.css` for the cases CSS owns (hover/focus transitions), so
no component defines a duration inline. Every image in the world goes through
`SceneImage`, which owns the decorative attribute set (`alt=""`, `aria-hidden`,
`decoding="async"`, lazy by default) in one place — including a `motion` variant,
so pieces that animate `opacity` or `rotate` off a `MotionValue` do not have to
hand-roll a `motion.img` and silently opt out of those defaults.

A layered domain/application/infrastructure structure would be the wrong shape
for a static landing page, and is deliberately not used.

## Assumptions

- **Three slides, not seven.** The brief asks for any three; the recommended set
  was taken.
- **Original assets.** Source art is licensed from Vecteezy and recoloured to a
  red/ink palette. The reference's NFT artwork is its own IP and the brief
  explicitly permits swapping.
- **The scrollbar is hidden.** `scrollbar-width: none` plus the WebKit
  pseudo-element, so the full-bleed scene has no chrome over it. Scrolling
  itself is untouched — this hides the indicator, it does not disable the
  scroll container.
- **Minimal copy on the panels.** The lockup and the one CTA sit as fixed page
  furniture over the track rather than inside a panel, so the scene stays the
  subject and the reveals are not competing with body text. Buttons are
  clickable and carry hover states, but the CTA opens an in-page layer rather
  than navigating — the brief asks for hover states *and* for no working CTAs,
  and a layer satisfies both.
- **Pinning was treated as in scope.** The brief lists parallax and pinning as
  "and/or"; the horizontal track is a pin, and carries the parallax with it.
- **Three panels is a content decision, not a limit.** `<HorizontalTrack panels={n}>`
  derives its scroll budget and travel from `n`; adding a fourth panel is one
  array entry and one prop.

## Known limitations

Recorded rather than hidden — each of these is a conscious trade at the 4–6 hour
scope, not an oversight.

- **Relics have no `dragConstraints`.** A relic can be dragged out of the scene's
  `overflow: hidden` container with no way to retrieve it. The correct fix points
  `dragConstraints` at a ref for the track viewport, which means plumbing a ref
  through two components; a pixel constraint box would have broken the unit
  discipline the rest of the project holds to.
- **No focus trap in the collection dialog.** Focus moves into the dialog on
  open, Escape and Close both work, and `role="dialog"` + `aria-modal` announce
  it correctly — but Tab can still walk out into the page behind. That is the
  next accessibility step.
- **The preloader has a floor but no ceiling.** It gates on `window.load` plus a
  1.1 s minimum, so a slow connection can hold it for several seconds after the
  scene has already painted underneath. A `Promise.race` against a ~2.5 s cap is
  two lines; what is missing is the feel decision about the number.
- **Images carry no intrinsic `width`/`height`.** CLS measures 0, and
  `SceneImage` deliberately avoids that contract because the art is sized in
  world units against the horizon — but Lighthouse flags it.
- **No `srcset`.** The same asset serves a 390px phone and a 2560px desktop;
  ~200 KB is wasted on mobile. The 210 KB background texture was the one clear
  win and was taken (−42%).
- **Safari is untested.** Chrome and Firefox are verified — Firefox was the real
  risk for the `feImage` filter path. Safari shares enough of WebKit's filter
  implementation that it is low-risk, but it has not been checked.
- **No tests.** `zoneX`, `stanceWindow` and `ramp` are pure functions with real
  arithmetic and would be the first unit-test targets.

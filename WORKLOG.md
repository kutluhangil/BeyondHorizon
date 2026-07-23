# Worklog

Chronological record of substantive changes, with the reasoning and the
measurements behind them. Written to be read before touching this code again,
not as a release changelog.

---

## 2026-07-23 — Rename, landing page, HUD redesign, performance pass

Starting point: a working single-page Schwarzschild raytracer downloaded as a
finished bundle, named GARGANTUA, served from `gargantua/`. It rendered
correctly but stuttered, and the HUD read as a generic sci-fi overlay.

### 1. Project rename

`gargantua/` → `beyond-horizon/`. Renamed in the product surface only:

| Thing | Before | After |
|---|---|---|
| Wordmark, page titles | GARGANTUA | BEYOND HORIZON |
| localStorage key | `gargantua.params.v1` | `beyondhorizon.params.v1` |
| Console tag | `[GARGANTUA]` | `[BEYOND HORIZON]` |

**Audio filenames were deliberately left alone** (`audio/gargantua-main.mp3`,
`-intro.mp3`, `.ogg`, `.opus`). They are assets, not branding, and renaming
them buys nothing while touching four files and the codec-probe chain in
`js/main.js` (~line 350).

Side effect worth knowing: the localStorage key change resets any saved
parameter tweaks once, for everyone. Accepted as part of the rename.

### 2. Page structure

The simulator used to be `index.html`. It now sits at `explore.html`, and
`index.html` is a new landing page.

```
beyond-horizon/
  index.html        landing page                      (new)
  explore.html      the simulator                     (was index.html)
  css/landing.css   landing styles                    (new)
  css/style.css     simulator styles                  (rewritten)
  js/hero.js        landing hero renderer             (new)
  js/main.js        simulator                         (edited)
  js/shaders.js     GLSL, shared by both pages        (edited)
  vendor/           pinned three.js + addons          (untouched)
  audio/            score                             (untouched)
```

### 3. Design direction

The old interface was cyan + amber hairlines with corner brackets: correct for
the subject, but the default answer for it. Two things changed.

**Palette is derived from the shader's own `blackbody()` ramp.** The interface
and the disk it describes now use the same colour language, and the accent is
ember rather than the usual HUD cyan.

| Token | Value | Comes from |
|---|---|---|
| `--ember` | `#ff6b1f` | `blackbody(0.5)`, the receding limb |
| `--flare` | `#ffd08a` | `blackbody(1.05)`, peak emission |
| `--photon` | `#bcd8ff` | `blackbody(1.9)`, the approaching limb |
| `--dust` | `#7c869c` | muted, for labels and inactive state |
| `--paper` | `#e9eef7` | primary text |
| `--void` / `--deep` | `#04050a` / `#080b13` | ground |

Both stylesheets declare these independently; there is no shared token file.
If you change one, change the other.

**Wordmark: the rule between the two words is the horizon.** "BEYOND" sits
above it in paper, "HORIZON" below it in ember, dimmed. Light climbing out of
a well loses energy, so the half below the line is redshifted. Both words are
per-letter `<i>` spans in a `display:flex; justify-content:space-between`
block, which is what makes a 6-letter and a 7-letter word share the same
measure. Do not replace the spans with `letter-spacing`; the edges stop
aligning.

**Deck: rows, not a grid of centred buttons.** Each control is
`label · state · key badge`, the same grammar as the telemetry above it,
grouped under Vantage / Motion / Render. The old orphaned two-line hint block
is gone because every row now carries its own key. Active state is an ember
left edge plus a flare value, replacing the muddy filled amber box.

**Radial scale under the wordmark** is the signature element: a log axis from
1 to 60 R<sub>s</sub> with a live caret for the observer. Ticks are labelled 1
and 3 only. 1.5 keeps an unlabelled lit notch because at 240px the labels
collide.

**One spacing scale everywhere**: 4 / 8 / 12 / 16 / 24 / 32. The old CSS mixed
5px, 6px, 9px and 11px gaps with no system.

The landing page uses a **linear 1 → 3.2 R<sub>s</sub> axis**, not the log
1 → 60 one. Every radius that section discusses lives in that span, and adding
the 40 R<sub>s</sub> disk edge to the same rule crushes all four marks into the
first tenth of it.

### 4. Performance

Measured, not assumed. Method: headless Chrome with ANGLE/Metal, a 1-pixel
`gl.readPixels` per frame to force a genuine GPU round trip, 2535×1498
drawing buffer, 600 steps, three 10-second runs per build, alternated.

`gl.finish()` is **not** a usable sync in Chrome. WebGL runs out of process, so
`finish()` returns immediately and reports 0 ms for work it never waited on.
The first benchmark attempt reported a flat 175 fps for both builds because of
this. Use `readPixels`.

#### 4a. Shader (~3%, median 68.9 ms → 66.9 ms)

- **The big one:** in `diskCross`, `innerDetail = 1 - smoothstep(4, 18, qr)`
  is exactly 0 beyond 18 R<sub>s</sub>, at which point every `mix()` below it
  collapses to its constant term. Six five-octave FBM evaluations were being
  computed and thrown away across roughly 80% of the disk's area. Gated behind
  `if(innerDetail > 0.0)`. Output is bit-identical.
- `milkyway()` returns early when `band < 0.035`. Below that the result cannot
  reach one 8-bit step after ACES, which compresses toward zero in that range.
  Skips two FBM evaluations for about a third of escaping rays.
- `pow()` with known small exponents replaced by multiplies and `sqrt`:
  `pow(x,-3)` → `u*u*u`, `pow(x,0.25)` → `sqrt(sqrt(x))`, `pow(x,1.5)` →
  `x*sqrt(x)`, `pow(x,2)` → `x*x`. All exact.

Honest read: the shader was already well written. The raymarch loop dominates,
so these are worth 3% and no more. They are still worth keeping.

#### 4b. Compositor (~1–2 ms of a ~65 ms frame)

Removed the fullscreen `#fx` overlay (`mix-blend-mode: screen`) and the two
`backdrop-filter: blur()` panels. Both force the compositor to re-blend a
full-screen layer over a canvas that repaints every frame. The overlay's
radial vignette also duplicated the vignette the composite shader already
applies.

#### 4c. Resolution governor — this is the actual fix

The stutter was never subtle math. The cinematic profile ran 460 steps at a
fixed 3.8 Mpx budget, which measured **~65 ms per frame (about 15 fps)** on
the test machine. Nothing adapted.

`GOV` in `js/main.js` now measures frame time and scales **only the drawing
buffer**. Step count, bloom and the disk model are never touched, so a GPU
with headroom keeps the full image.

The first version of this was wrong and worth remembering: a fixed 45-frame
decision window means the window itself scales with the problem. At 7 fps that
is 6.4 seconds per correction, and it moved 1.00 → 0.76 over 30 seconds while
still stuttering. Fixed by making the window time-based (`minFrames: 6` **and**
`minMs: 500`) and the step proportional. Ray cost is linear in pixel count and
pixels go as scale², so the correction that lands on target is
`sqrt(targetMs / measuredMs)`, clamped to `[0.6, 1.15]` per step.

| | Before | After |
|---|---|---|
| Convergence | 30 s, still falling | **2.5 s** |
| Frame rate | 12.8 fps | **47 fps** |

Floor is `GOV.min = 0.4`. The current buffer scale is surfaced honestly in the
telemetry as `BUFFER SCALE`, so a soft frame is explainable rather than
mysterious.

### 5. Landing hero

`js/hero.js` runs the same geodesic kernel from `shaders.js` on a deliberately
small budget: two passes (ray → composite), no `EffectComposer`, no bloom,
300 steps, 0.75 Mpx. An `IntersectionObserver` cancels the rAF loop entirely
once the hero scrolls out of view, and `prefers-reduced-motion` renders a
single still frame.

Two tuning notes:

- **Below ~280 steps the shadow edge smears.** Rays skimming the photon sphere
  exhaust their budget and get dimmed by the `deep` factor instead of being
  captured, which reads as a soft halo rather than a hard edge. 170 steps
  looked broken; 300 does not. Buy the steps out of the pixel budget, not the
  other way round.
- There is no bloom pass here, so `uDiskBright` is raised to 1.4 and
  `uVignette` lowered to 0.95 to compensate. Those numbers exist only because
  bloom is absent.

### 6. Bugs found during verification

Caught by screenshotting rather than by reading the code:

- `.steps li` is a two-column grid with **three** children (`::before`, `h3`,
  `p`). The paragraph flowed into the 68px counter column and wrapped to one
  word per line. Fixed with explicit `grid-column` / `grid-row` placement.
- `.keyrow kbd` used `min-width`, so "SCROLL" and "1" pushed the label column
  to different x positions. Now a fixed `width: 62px`.
- 1px axis notches at fractional percentages antialias across two columns and
  read washed out. Now 2px with `margin-left: -1px`.
- The simulator subtitle wrapped "M☉" onto a second line. Reordered to lead
  with the mass and added `white-space: nowrap`.

### 7. Verification

- Shader validity: `explore.html?shot` sets `document.title = 'SHOT_OK'` after
  four rendered frames. It does, so the GLSL compiles and links.
- Visual regression: captured via the built-in `?capture=canvas` harness and
  compared against `repair-evidence/after_poster.png`. Identical.
- **Headless `--screenshot` cannot capture a WebGL canvas.** It returns a black
  frame while the DOM overlay captures fine. This is not a rendering bug and
  cost an hour to rule out. Use `?shot&capture=canvas` and read
  `window.__SHOT_PNG` over CDP, or `Page.captureScreenshot` in headful.

### 8. Deployment

Static, no build step. `vercel.json` points `outputDirectory` at
`beyond-horizon/`. `cleanUrls` is intentionally off: the pages link to
`explore.html` directly, and enabling it would add a redirect hop.

### Known limitations

- No shared design-token source between `style.css` and `landing.css`.
- The governor only scales resolution. If it pins at the 0.4 floor and is
  still slow, the user has to drop the render profile manually with `Q`.
- `?shot` mode bypasses the governor so captures stay deterministic. Anything
  that benchmarks through `?shot` is measuring a fixed resolution.

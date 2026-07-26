<div align="center">

<br />

<img src="https://img.shields.io/badge/Beyond_Horizon-v1.0-ff6b1f?style=for-the-badge&logoColor=white" alt="version" />
<img src="https://img.shields.io/badge/WebGL2-GLSL_ES_300-ffd08a?style=for-the-badge&logoColor=black" alt="webgl2" />
<img src="https://img.shields.io/badge/Three.js-r178-bcd8ff?style=for-the-badge&logo=threedotjs&logoColor=black" alt="threejs" />
<img src="https://img.shields.io/badge/Vanilla-ES_Modules-f7df1e?style=for-the-badge&logo=javascript&logoColor=black" alt="javascript" />
<img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="vercel" />
<img src="https://img.shields.io/badge/No_Build_Step-Static_HTML-3ecf8e?style=for-the-badge&logoColor=white" alt="static" />
<img src="https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge" alt="license" />

<br /><br />

```
  ██████╗ ███████╗██╗   ██╗ ██████╗ ███╗   ██╗██████╗
  ██╔══██╗██╔════╝╚██╗ ██╔╝██╔═══██╗████╗  ██║██╔══██╗
  ██████╔╝█████╗   ╚████╔╝ ██║   ██║██╔██╗ ██║██║  ██║
  ██╔══██╗██╔══╝    ╚██╔╝  ██║   ██║██║╚██╗██║██║  ██║
  ██████╔╝███████╗   ██║   ╚██████╔╝██║ ╚████║██████╔╝
  ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═════╝

  ██╗  ██╗ ██████╗ ██████╗ ██╗███████╗ ██████╗ ███╗   ██╗
  ██║  ██║██╔═══██╗██╔══██╗██║╚══███╔╝██╔═══██╗████╗  ██║
  ███████║██║   ██║██████╔╝██║  ███╔╝ ██║   ██║██╔██╗ ██║
  ██╔══██║██║   ██║██╔══██╗██║ ███╔╝  ██║   ██║██║╚██╗██║
  ██║  ██║╚██████╔╝██║  ██║██║███████╗╚██████╔╝██║ ╚████║
  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝
```

### **Real-time Schwarzschild black hole raytracing** — one null geodesic integrated per pixel, every frame, live in your browser. No server. No mesh. No pre-rendered footage.

*"Do not go gentle into that good night."*

[**Enter the Simulation →**](https://beyond-horizon.vercel.app/explore.html) · [Report a Bug](https://github.com/kutluhangil/BeyondHorizon/issues) · [Request a Feature](https://github.com/kutluhangil/BeyondHorizon/issues)

</div>

---

## ✦ What is Beyond Horizon?

**Beyond Horizon** is a physically accurate, real-time black hole raytracer that runs entirely in the browser using WebGL2 and vanilla ES modules. It renders a **Schwarzschild black hole** by integrating a null geodesic (a photon's curved path through spacetime) for every single pixel on screen — up to 460 steps per ray, every frame, with no pre-computation or baked textures.

The simulation models:
- **Gravitational lensing** — the entire background star field bends around the hole
- **Accretion disk** — Novikov–Thorne flux model with FBM turbulence and inner structure detail
- **Relativistic beaming** — the approaching limb blazes blue-white; the receding limb dims to deep red
- **Gravitational redshift** — photons climbing out of the potential well lose energy
- **Photon sphere** — rays grazing 1.5 Rₛ wind around the hole and escape, tracing the bright photon ring
- **ACES tone mapping + bloom** — the photon ring feeds a selective bloom pass; grain and vignette are composited in the final pass

---

## ⚡ Key Features

| Feature | Description |
|---|---|
| 🌑 **Live Raytracing** | Schwarzschild metric, null-geodesic integration — 460 steps per ray, per pixel, per frame |
| 🌀 **Accretion Disk** | Novikov–Thorne flux + FBM turbulence, clamped to ISCO at 3 Rₛ, extending to 40 Rₛ |
| 💫 **Relativistic Effects** | Doppler beaming, gravitational redshift, photon sphere, shadow magnification (√27 / 2) |
| 🎥 **Cinematic Camera** | 8-keyframe cinematic path with smooth interpolation; manual override on any gesture |
| 📐 **4 Vantage Presets** | Poster (24 Rₛ · 38°), Edge-on (6° above disk), Polar (axis view), Close pass (9 Rₛ) |
| ⚙️ **21 Live Parameters** | Full physics console with persistence — spin speed, disk tilt, bloom, grain, debug modes 0–9 |
| 📊 **Adaptive Resolution Governor** | Automatically scales the drawing buffer to hit target frame time; converges in ~2.5 s |
| 🔊 **Generative Audio** | Procedurally synthesised sub-bass drone + intro sting (opus / mp3 / ogg) |
| 🖥️ **No Build Step** | Pure HTML + ES modules + vendored Three.js — open in any server and it runs |
| ♿ **Accessible** | `prefers-reduced-motion` renders a single still frame; ARIA labels on all interactive regions |

---

## 🖼️ Screenshots

> *(Live demo: [beyond-horizon.vercel.app](https://beyond-horizon.vercel.app))*

---

## 🛠️ Technology Stack

```
Runtime         →  WebGL2 (GLSL ES 3.00) — null-geodesic integrator runs entirely on GPU
3D Framework    →  Three.js r178 (vendored, no npm, importmap)
Postprocessing  →  Three.js EffectComposer — UnrealBloomPass (photon ring only) + composite pass
Language        →  Vanilla JavaScript, ES modules, no transpilation
Styles          →  Vanilla CSS — ember/flare/photon colour palette derived from the shader's blackbody ramp
Audio           →  Web Audio API + HTMLMediaElement (opus primary / mp3 / ogg fallback)
Deployment      →  Vercel — static, no build step, outputDirectory: beyond-horizon/
Caching         →  immutable 1-year headers on vendor/ and audio/ assets
Physics model   →  Schwarzschild metric, Novikov–Thorne accretion disk flux, Runge–Kutta-style integration
Disk model      →  ISCO at 3 Rₛ · outer edge at 40 Rₛ · FBM turbulence gated by innerDetail > 0
Resolution gov  →  GOV: time-based window (minFrames:6 + minMs:500), step = √(targetMs/measuredMs), clamp [0.6, 1.15]
```

---

## 📐 Project Structure

```
BeyondHorizon/
├── beyond-horizon/           ← static output (Vercel serves this directory)
│   ├── index.html            landing page — hero renderer, geometry explainer, pipeline, controls
│   ├── explore.html          the simulator — full HUD, flight deck, parameters panel
│   ├── css/
│   │   ├── landing.css       landing page styles (ember palette, axis scale, keymap)
│   │   └── style.css         simulator styles (HUD, deck, telemetry, params panel)
│   ├── js/
│   │   ├── shaders.js        GLSL source strings — RAY_VERT, RAY_FRAG, COMPOSITE_FRAG
│   │   ├── hero.js           landing hero renderer (300 steps, 0.75 Mpx, no bloom)
│   │   └── main.js           simulator — renderer, camera, GOV, audio, hotkeys, params, HUD
│   ├── vendor/               pinned Three.js r178 + addons (immutable cache)
│   │   ├── three.module.js
│   │   └── jsm/              OrbitControls, EffectComposer, bloom, shaders
│   └── audio/                procedurally synthesised score
│       ├── gargantua-main.opus / .mp3 / .ogg   (176 s seamless loop)
│       └── gargantua-intro.mp3                 (7 s intro sting)
├── vercel.json               outputDirectory, cleanUrls:false, immutable asset headers
├── WORKLOG.md                detailed engineering log — decisions, measurements, known limitations
├── plan.md                   original build spec (17-section engineering brief)
└── plan2.md                  incremental repair & calibration spec
```

---

## 🔭 The Physics

Beyond Horizon renders a **Schwarzschild black hole** — a non-rotating, uncharged mass. The only parameter that matters is distance from the singularity, measured in Schwarzschild radii (Rₛ).

| Radius | Landmark | What it means |
|:-:|---|---|
| **1.0 Rₛ** | Event horizon | The last surface anything crosses in one direction. No photon returns. |
| **1.5 Rₛ** | Photon sphere | Light can orbit here. Rays grazing this radius produce the bright photon ring. |
| **2.6 Rₛ** | Apparent shadow edge | Gravity magnifies the shadow to √27 / 2 radii for a distant observer. |
| **3.0 Rₛ** | ISCO | Gas cannot hold a circular orbit any closer. The disk's hottest, fastest, brightest edge. |
| **40 Rₛ** | Disk outer edge | The accretion disk fades beyond this radius. |

---

## 🎬 Render Pipeline

Each frame runs the same pipeline for every pixel:

```
1. CAST      →  pixel → ray, aimed through the observer's field of view
2. INTEGRATE →  step through the Schwarzschild metric, refining near r < 4.4 Rₛ
3. CROSS     →  disk intersections add Novikov–Thorne flux, Doppler-shifted and redshifted
4. ESCAPE    →  rays that clear the well sample the lensed star field along their final direction
5. GRADE     →  bloom (photon ring only) → ACES tone map → vignette → film grain
```

The compositor (`COMPOSITE_FRAG`) applies chromatic aberration, ACES, a vignette and a per-frame grain seed. Bloom is fed exclusively from the photon ring luminance channel to prevent the disk from blooming.

---

## ⌨️ Controls

The camera starts on a cinematic path. Any gesture takes manual control instantly.

| Input | Action |
|---|---|
| `Drag` | Orbit the black hole |
| `Scroll / Pinch` | Close in or pull back |
| `1` | Poster vantage — 24 Rₛ, 38° above the disk |
| `2` | Edge-on — 26 Rₛ, 6° above the disk |
| `3` | Polar — 28 Rₛ, looking down the rotation axis |
| `4` | Close pass — 9 Rₛ, 14° |
| `C` | Cinematic path on / off |
| `R` | Auto orbit |
| `Q` | Cycle render profile (Standard → High → Cinematic) |
| `P` | Open the 21-parameter physics console |
| `H` | Hide / show telemetry |
| `M` | Toggle sound |

---

## 🎨 Design System

The interface palette is derived directly from the shader's own `blackbody()` ramp — the same colour language used by the disk it describes.

| Token | Value | Origin |
|---|---|---|
| `--ember` | `#ff6b1f` | `blackbody(0.5)` — the receding limb |
| `--flare` | `#ffd08a` | `blackbody(1.05)` — peak disk emission |
| `--photon` | `#bcd8ff` | `blackbody(1.9)` — the approaching limb |
| `--dust` | `#7c869c` | muted, for labels and inactive state |
| `--paper` | `#e9eef7` | primary text |
| `--void` | `#04050a` | deepest background |
| `--deep` | `#080b13` | secondary background |

The wordmark is the metaphor made visible: `BEYOND` sits above the rule in paper; `HORIZON` sits below it in ember, dimmed — light climbing out of a gravity well loses energy, so the half below the horizon is redshifted.

---

## ⚡ Performance

The resolution governor (`GOV` in `js/main.js`) is the most important part of the runtime. It measures real frame time with `performance.now()` + `gl.readPixels()` (the only reliable GPU sync in Chrome) and scales the drawing buffer to keep frame time near the target.

| | Before GOV | After GOV |
|---|---|---|
| Convergence | 30 s, still falling | **~2.5 s** |
| Frame rate | ~13 fps | **~47 fps** |

The step size is `√(targetMs / measuredMs)`, clamped to `[0.6, 1.15]` per correction. The window is time-based (`minFrames: 6` **and** `minMs: 500`) so it doesn't stall at very low frame rates. The current buffer scale is always visible in the telemetry as `BUFFER SCALE`.

---

## 🚀 Running Locally

No build step. Serve `beyond-horizon/` from any static server:

```bash
# Clone the repository
git clone https://github.com/kutluhangil/BeyondHorizon.git
cd BeyondHorizon

# Serve with Python (or any other static server)
python3 -m http.server 8123 --directory beyond-horizon

# Then open:
# http://localhost:8123/          → landing page
# http://localhost:8123/explore.html → simulator
```

> ⚠️ **Must be served over HTTP/HTTPS** — ES modules and audio loading are blocked by `file://` in most browsers.

### Shot / Testing Mode

Append `?shot` to trigger automated verification. The page renders four frames and sets `document.title = 'SHOT_OK'` on success. Combine with `?cam=poster|edge|polar|close` and `?q=standard|high|cinematic` for specific vantage + quality combinations.

```bash
# Example: cinematic quality, edge-on vantage
http://localhost:8123/explore.html?shot&cam=edge&q=cinematic
```

---

## 📦 Deployment

The project deploys to Vercel with zero configuration beyond `vercel.json`. `cleanUrls` is intentionally `false` — pages link to `explore.html` directly and enabling it would add a redirect hop.

```bash
# Deploy to Vercel (first time)
vercel

# Deploy to production
vercel --prod
```

Vendor and audio assets are served with `Cache-Control: public, max-age=31536000, immutable` — they never change between deployments.

---

## 🗺️ Roadmap

| Status | Feature |
|:-:|---|
| ✅ | Schwarzschild null-geodesic raytracer (WebGL2 / GLSL) |
| ✅ | Novikov–Thorne accretion disk with FBM turbulence |
| ✅ | Relativistic Doppler beaming + gravitational redshift |
| ✅ | Photon sphere + photon ring bloom |
| ✅ | Lensed Milky Way star field |
| ✅ | Adaptive resolution governor |
| ✅ | 21-parameter physics console with persistence |
| ✅ | Cinematic camera path (8 keyframes) |
| ✅ | 4 vantage presets |
| ✅ | Procedurally synthesised ambient score |
| ✅ | Landing page with physics explainer |
| ✅ | Vercel deployment |
| ○ | Kerr metric (rotating black hole) |
| ○ | Mobile touch optimisation |
| ○ | Sharable parameter URLs |
| ○ | Screenshot / export |

<sub>✅ Complete &nbsp;·&nbsp; ○ Planned</sub>

---

## 🤝 Contributing

Contributions are welcome — open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/kerr-metric`)
3. Make your changes — no build step needed, just edit and refresh
4. Open a pull request

> **⚠️ Shader changes** should include a note on measured frame-time impact (methodology: `gl.readPixels` per frame to force a real GPU round-trip, not `gl.finish()`).

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE).

---

<div align="center">

<br />

Built with ☕ and a geodesic integrator by [**Kutluhan Gil**](https://github.com/kutluhangil)

<br />

*If it bent spacetime for you, leave a ⭐*

<br />

</div>

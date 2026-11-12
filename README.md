<div align="center">

<img src="docs/media/hero.svg" alt="Beyond Horizon — real-time Schwarzschild black hole raytracing in the browser" width="100%">

<p>
  <a href="https://beyond-horizon-omega.vercel.app/explore.html"><img alt="Live demo" src="https://img.shields.io/badge/live%20demo-enter%20the%20simulation-ffb15c?style=for-the-badge&labelColor=020104"></a>
  <img alt="WebGL2" src="https://img.shields.io/badge/WebGL2-per--pixel%20geodesics-ff5e3a?style=for-the-badge&labelColor=020104">
  <img alt="No build" src="https://img.shields.io/badge/build%20step-none-8fb8ff?style=for-the-badge&labelColor=020104">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-ffb15c?style=for-the-badge&labelColor=020104">
</p>

<p><em>A physically based black hole, raytraced live: one null geodesic integrated per pixel, every frame.<br>
No server, no mesh, no pre-rendered footage.</em></p>

<a href="https://beyond-horizon-omega.vercel.app/explore.html"><img src="repair-evidence/after_poster.png" alt="The black hole from the poster vantage: lensed disk and photon ring" width="100%"></a>

</div>

<img src="docs/media/divider.svg" width="100%" alt="">

## What it simulates

Beyond Horizon renders a **Schwarzschild black hole** with WebGL2 and plain ES modules. Each pixel casts a ray and steps it through the curved metric until it falls in, crosses the disk or escapes to the stars.

| | |
|---|---|
| **Gravitational lensing** | The whole background star field bends around the hole. |
| **Accretion disk** | A Novikov–Thorne flux model with FBM turbulence and inner structure. |
| **Relativistic beaming** | The approaching limb blazes blue-white; the receding limb dims to deep red. |
| **Gravitational redshift** | Photons climbing out of the well lose energy. |
| **Photon sphere** | Rays grazing 1.5 Rₛ wind around the hole and trace the bright photon ring. |
| **Grading** | Bloom fed only by the photon ring, ACES tone mapping, vignette and film grain. |

<img src="docs/media/divider.svg" width="100%" alt="">

## The render pipeline

```mermaid
flowchart LR
  C[1 · Cast<br/>pixel → ray] --> I[2 · Integrate<br/>Schwarzschild metric,<br/>refined below 4.4 Rₛ]
  I --> X[3 · Cross<br/>disk flux, Doppler + redshift]
  I --> E[4 · Escape<br/>lensed star field]
  X --> G[5 · Grade<br/>ring bloom → ACES → grain]
  E --> G
```

<img src="docs/media/divider.svg" width="100%" alt="">

## Controls

| Input | Effect |
|---|---|
| Drag | Orbit the black hole |
| Scroll / pinch | Close in or pull back |
| <kbd>1</kbd> | Poster vantage: 24 Rₛ, 38° above the disk |
| <kbd>2</kbd> | Edge-on: 26 Rₛ, 6° above the disk |
| <kbd>3</kbd> | Polar: 28 Rₛ, down the rotation axis |
| <kbd>4</kbd> | Close pass: 9 Rₛ, 14° |
| <kbd>C</kbd> / <kbd>R</kbd> | Cinematic path · auto orbit |
| <kbd>Q</kbd> | Cycle render profile: Standard → High → Cinematic |
| <kbd>P</kbd> | Open the 21-parameter physics console |

<img src="docs/media/divider.svg" width="100%" alt="">

## Türkçe özet

**Beyond Horizon**, tarayıcıda gerçek zamanlı çalışan fiziksel bir kara delik ışın izleyicisi. Her piksel için Schwarzschild metriğinde bir ışık yolu (null geodezik) hesaplanıyor. Kütleçekimsel merceklenme, Novikov–Thorne birikim diski, göreli parlama, kütleçekimsel kızıla kayma ve foton küresi canlı olarak çiziliyor. Sunucu, model dosyası ya da önceden render edilmiş video yok; yalnızca WebGL2 ve sade JavaScript modülleri var.

<img src="docs/media/divider.svg" width="100%" alt="">

## Running locally

There is no build step. Serve `beyond-horizon/` from any static server:

```sh
python3 -m http.server 8123 --directory beyond-horizon
# http://localhost:8123/              landing page
# http://localhost:8123/explore.html  simulator
```

```
beyond-horizon/
  index.html     landing page
  explore.html   the simulator
  js/            raytracer, controls, physics console
  css/           styles
  vendor/        pinned third-party modules
```

<div align="center">
<br>
<a href="https://github.com/kutluhangil"><img src="docs/media/signature.svg" width="100%" alt="Built by kutluhangil"></a>
<sub>"Do not go gentle into that good night."</sub>
</div>

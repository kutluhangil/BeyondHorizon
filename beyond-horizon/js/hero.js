// BEYOND HORIZON — landing hero.
// The same geodesic kernel the simulator runs, on a deliberately small budget:
// two passes (ray + composite), no bloom, no controls, and no frames at all
// while the hero is off screen.

import * as THREE from 'three';
import { RAY_VERT, RAY_FRAG, COMPOSITE_VERT, COMPOSITE_FRAG } from './shaders.js';

const HERO = {
  // Below ~280 steps the rays skimming the shadow run out of budget and get
  // dimmed rather than captured, which reads as a smeared edge instead of a
  // hard one. Buy the steps back out of the pixel budget.
  steps: 300,
  pixels: 7.5e5,       // drawing-buffer budget
  maxDpr: 1.5,
  radius: 34,
  inclination: 22 * Math.PI/180,
  rate: 0.028,         // rad/s — one revolution every ~3.7 minutes
};

const canvas = document.getElementById('hero');
if(canvas) start(canvas);

function start(canvas){
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'default' });
  } catch(err){
    document.body.classList.add('hero-unavailable');
    return;
  }
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.PlaneGeometry(2, 2);

  const rayUniforms = {
    uRes:        { value: new THREE.Vector2(1, 1) },
    uTime:       { value: 0 },
    uCamPos:     { value: new THREE.Vector3() },
    uCamTarget:  { value: new THREE.Vector3(0, 0, 0) },
    uFov:        { value: 1/Math.tan(46 * Math.PI/180 / 2) },
    uSteps:      { value: HERO.steps },
    uRotSign:    { value: 1 },
    uDebug:      { value: 0 },
    uDin:        { value: 2.75 },
    uDout:       { value: 40 },
    uDopMax:     { value: 1.85 },
    uOpNear:     { value: 0.90 },
    uOpFar:      { value: 0.80 },
    // no bloom pass here, so the disk carries its own glow instead
    uDiskBright: { value: 1.4 },
    uStarBright: { value: 1 },
    uSkyFloor:   { value: 0.04 },
    uRotSpeed:   { value: 1 },
  };
  const rayMat = new THREE.ShaderMaterial({
    vertexShader: RAY_VERT, fragmentShader: RAY_FRAG,
    uniforms: rayUniforms, depthTest: false, depthWrite: false,
  });
  scene.add(new THREE.Mesh(quad, rayMat));

  const target = new THREE.WebGLRenderTarget(2, 2, { depthBuffer: false });
  const postScene = new THREE.Scene();
  const postUniforms = {
    tDiffuse:  { value: target.texture },
    uRes:      { value: new THREE.Vector2(1, 1) },
    uTime:     { value: 0 },
    uVignette: { value: 0.95 },
    uGrain:    { value: 0.05 },
    uCA:       { value: 0.0032 },
  };
  postScene.add(new THREE.Mesh(quad, new THREE.ShaderMaterial({
    vertexShader: COMPOSITE_VERT, fragmentShader: COMPOSITE_FRAG,
    uniforms: postUniforms, depthTest: false, depthWrite: false,
  })));

  const size = new THREE.Vector2();
  function resize(){
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    const dpr = Math.max(0.5, Math.min(
      window.devicePixelRatio || 1,
      HERO.maxDpr,
      Math.sqrt(HERO.pixels/Math.max(1, w*h))));
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    renderer.getDrawingBufferSize(size);
    target.setSize(size.x, size.y);
    rayUniforms.uRes.value.copy(size);
    postUniforms.uRes.value.copy(size);
  }

  const reduced = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let raf = 0;
  let last = performance.now();
  let t = 0;
  let visible = true;
  let revealed = false;

  function frame(){
    const now = performance.now();
    const dt = Math.min(0.1, Math.max(0.0005, (now - last)/1000));
    last = now;
    if(!reduced) t += dt;

    const a = t*HERO.rate + 0.6;
    rayUniforms.uCamPos.value.set(
      HERO.radius*Math.cos(HERO.inclination)*Math.sin(a),
      HERO.radius*Math.sin(HERO.inclination),
      HERO.radius*Math.cos(HERO.inclination)*Math.cos(a));
    rayUniforms.uTime.value = t;
    postUniforms.uTime.value = t;

    renderer.setRenderTarget(target);
    renderer.render(scene, cam);
    renderer.setRenderTarget(null);
    renderer.render(postScene, cam);

    if(!revealed){ revealed = true; document.body.classList.add('hero-live'); }

    // a still frame is the whole point under reduced motion: render once
    raf = (visible && !document.hidden && !reduced) ? requestAnimationFrame(frame) : 0;
  }

  function play(){
    if(raf || !visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function pause(){
    if(raf){ cancelAnimationFrame(raf); raf = 0; }
  }

  window.addEventListener('resize', () => { resize(); if(!raf) frame(); });
  document.addEventListener('visibilitychange', () => document.hidden ? pause() : play());

  // scrolled past the hero: stop paying for pixels nobody is looking at
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      visible ? play() : pause();
    }, { threshold: 0 }).observe(canvas);
  }

  resize();
  frame();
}

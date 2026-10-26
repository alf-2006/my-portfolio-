"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __introRevealed?: boolean;
  }
}

/** Approved ALF artwork: colour texture + per-pixel "reveal time" map traced along the ribbon. */
const TEX_URL = "/brand/alf-logo.webp";
const MAP_URL = "/brand/alf-logo-time.png";
const ASPECT = 1600 / 898;
const INTRO_KEY = "alf-intro-seen";

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uWave;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += (sin(p.x * 2.3 + uTime * 0.9) * 0.022 + cos(p.y * 3.1 + uTime * 0.7) * 0.014) * uWave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;   // premultiplied colour
  uniform sampler2D uMap;   // reveal time 0..1
  uniform float uDraw;
  uniform float uStart;
  uniform float uGlow;
  uniform float uSweep;
  uniform float uOpacity;
  uniform vec2 uLight;
  uniform vec2 uTexel;
  varying vec2 vUv;

  float lum(vec2 uv) { return dot(texture2D(uTex, uv).rgb, vec3(0.299, 0.587, 0.114)); }

  void main() {
    vec4 c = texture2D(uTex, vUv);
    if (c.a < 0.003) discard;
    float t = texture2D(uMap, vUv).r;
    float w = 0.016;
    // enter once the draw head passes t, leave once the tail passes t (both reach every pixel at 0 and 1)
    float m = smoothstep(t, t + w, uDraw * (1.0 + w));
    m *= 1.0 - smoothstep(t, t + w, uStart * (1.0 + w));
    if (m < 0.002) discard;

    // relight the baked art a little: the satin answers the pointer
    float lx = lum(vUv + vec2(uTexel.x, 0.0)) - lum(vUv - vec2(uTexel.x, 0.0));
    float ly = lum(vUv + vec2(0.0, uTexel.y)) - lum(vUv - vec2(0.0, uTexel.y));
    vec3 n = normalize(vec3(-lx * 3.0, -ly * 3.0, 1.0));
    vec3 L = normalize(vec3(uLight.x * 1.2 + 0.35, uLight.y * 1.2 + 0.45, 0.75));
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(n, H), 0.0), 56.0) * 0.32;

    float band = vUv.x * 0.82 + vUv.y * 0.38;
    float sweep = exp(-pow((band - uSweep) / 0.055, 2.0)) * 0.2;

    float front = exp(-pow((uDraw * (1.0 + w) - t - w * 0.5) / 0.02, 2.0)) * uGlow;

    vec3 col = c.rgb + (spec + sweep) * c.a * vec3(0.9, 0.94, 1.0);
    col = mix(col, vec3(1.0, 0.78, 0.22) * c.a, clamp(front * 0.6, 0.0, 1.0));
    gl_FragColor = vec4(col * m * uOpacity, c.a * m * uOpacity);
  }
`;

const SHADOW_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform sampler2D uMap;
  uniform float uDraw;
  uniform float uStart;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float a = texture2D(uTex, vUv, 3.0).a;
    float t = texture2D(uMap, vUv, 2.0).r;
    // the shadow trails the draw head instead of running ahead of it
    float m = smoothstep(t, t + 0.06, uDraw * 1.06) * (1.0 - smoothstep(t, t + 0.06, uStart * 1.06));
    float o = a * m * uOpacity;
    gl_FragColor = vec4(vec3(0.07, 0.14, 0.42) * o, o);
  }
`;

export default function RibbonStage({ dir }: { dir: "ltr" | "rtl" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const root = document.documentElement;
    let disposed = false;
    let cleanup = () => {};

    const reveal = () => {
      if (window.__introRevealed) return;
      window.__introRevealed = true;
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}
      if (root.classList.contains("is-intro")) root.classList.add("intro-done");
      root.classList.remove("is-intro");
      window.dispatchEvent(new Event("alf:intro-reveal"));
    };
    const fail = () => {
      root.classList.add("no-webgl");
      reveal();
    };

    (async () => {
      const probe = document.createElement("canvas");
      if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return fail();

      const THREE = await import("three");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (disposed) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const rtl = dir === "rtl";
      const sign = rtl ? -1 : 1;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: true });
      } catch {
        return fail();
      }
      // the art is already final sRGB: pass colours through untouched
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.setClearColor(0x000000, 0);

      const loader = new THREE.TextureLoader();
      let tex: InstanceType<typeof THREE.Texture>;
      let map: InstanceType<typeof THREE.Texture>;
      try {
        [tex, map] = await Promise.all([loader.loadAsync(TEX_URL), loader.loadAsync(MAP_URL)]);
      } catch {
        renderer.dispose();
        return fail();
      }
      if (disposed) return;
      // decided after the textures arrive: the boot failsafe may already have revealed the page
      const intro = root.classList.contains("is-intro") && !reduce && !window.__introRevealed;
      tex.colorSpace = THREE.NoColorSpace;
      tex.premultiplyAlpha = true;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.needsUpdate = true;
      map.colorSpace = THREE.NoColorSpace;
      map.generateMipmaps = true;
      map.minFilter = THREE.LinearMipmapLinearFilter;
      map.needsUpdate = true;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0, 12);

      const uniforms = {
        uTex: { value: tex },
        uMap: { value: map },
        uDraw: { value: reduce ? 1 : 0 },
        uStart: { value: 0 },
        uGlow: { value: reduce ? 0 : 1 },
        uSweep: { value: -1 },
        uOpacity: { value: 1 },
        uLight: { value: new THREE.Vector2(0, 0) },
        uTexel: { value: new THREE.Vector2(1.6 / 1600, 1.6 / 898) },
        uTime: { value: 0 },
        uWave: { value: reduce ? 0 : 1 },
      };
      const blend = {
        transparent: true,
        depthWrite: false,
        depthTest: false,
        premultipliedAlpha: true,
        blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
      } as const;
      const geometry = new THREE.PlaneGeometry(ASPECT, 1, 96, 54);
      const material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, ...blend });
      const shadowUniforms = {
        uTex: { value: tex },
        uMap: { value: map },
        uDraw: uniforms.uDraw,
        uStart: uniforms.uStart,
        uOpacity: { value: 0.16 },
        uTime: uniforms.uTime,
        uWave: { value: 0 },
      };
      const shadowMat = new THREE.ShaderMaterial({ uniforms: shadowUniforms, vertexShader: VERT, fragmentShader: SHADOW_FRAG, ...blend });
      const logo = new THREE.Mesh(geometry, material);
      const shadow = new THREE.Mesh(geometry, shadowMat);
      shadow.position.set(0.03, -0.075, -0.35);
      shadow.scale.set(1.02, 1.0, 1);
      logo.renderOrder = 2;
      shadow.renderOrder = 1;

      const inner = new THREE.Group(); // idle float + pointer tilt
      inner.add(shadow, logo);
      const outer = new THREE.Group(); // pose: intro → hero → scroll
      outer.add(inner);
      scene.add(outer);

      // ── layout (world units, logo height = 1 at scale 1) ──
      type Pose = { x: number; y: number; s: number };
      const L = { intro: { x: 0, y: 0, s: 1 } as Pose, hero: { x: 0, y: 0, s: 1 } as Pose, mobile: false, wpp: 0.01, visW: 1, visH: 1 };
      const computeLayout = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const aspect = w / h;
        const visH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const visW = visH * aspect;
        L.visW = visW;
        L.visH = visH;
        L.wpp = visH / h;
        const iS = Math.min(visH * 0.4, (visW * 0.8) / ASPECT);
        L.intro = { x: 0, y: visH * 0.04, s: iS };
        if (w >= 900 && aspect > 1.05) {
          L.mobile = false;
          const s = Math.min(visH * 0.36, (visW * 0.36) / ASPECT);
          // keep the logo inside the bordered frame, not against the viewport edge
          const frame = document.querySelector("main")?.getBoundingClientRect();
          const inset = frame ? Math.max(0, w - frame.right) : 0;
          const margin = (inset + Math.max(28, w * 0.03)) * L.wpp;
          L.hero = { x: (visW / 2 - (s * ASPECT) / 2 - margin) * sign, y: visH * 0.03, s };
        } else {
          L.mobile = true;
          const s = Math.min(visH * 0.25, (visW * 0.86) / ASPECT);
          const header = (72 / h) * visH;
          L.hero = { x: 0, y: visH / 2 - header - s / 2 - visH * 0.035, s };
        }
      };

      const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 900 ? 2 : 2));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        computeLayout();
        dirty = true;
      };

      // ── animated state ──
      const state = { draw: reduce ? 1 : 0, k: intro ? 0 : 1, heroP: 0, contactP: 0, formP: 0, swing: 0 };
      let dirty = true;
      const smooth = (a: number, b: number, x: number) => {
        const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
        return t * t * (3 - 2 * t);
      };

      const pctEl = document.querySelector<HTMLElement>("[data-intro-pct]");
      const introEl = document.querySelector<HTMLElement>(".intro");
      const skipEl = document.querySelector<HTMLButtonElement>("[data-intro-skip]");
      const setPct = () => {
        if (pctEl) pctEl.textContent = String(Math.round(state.draw * 100)).padStart(2, "0");
        introEl?.style.setProperty("--p", state.draw.toFixed(3));
      };

      let tl: gsap.core.Timeline | null = null;
      const onSkip = () => {
        if (!tl) return;
        tl.kill();
        tl = null;
        gsap.to(state, { draw: 1, duration: 0.35, ease: "power2.out", onUpdate: setPct });
        gsap.to(state, { k: 1, swing: 0, duration: 0.7, ease: "power3.inOut", onUpdate: () => (dirty = true) });
        gsap.to(uniforms.uGlow, { value: 0, duration: 0.5 });
        reveal();
      };

      if (reduce) {
        reveal();
      } else if (intro) {
        tl = gsap.timeline({ onUpdate: () => (dirty = true) });
        tl.to(state, { draw: 1, duration: 2.7, ease: "power1.inOut", onUpdate: setPct }, 0.25)
          .to(uniforms.uGlow, { value: 0, duration: 0.6 }, 2.9)
          .to(state, { k: 1, duration: 1.15, ease: "power3.inOut" }, 3.15)
          .fromTo(state, { swing: 0 }, { swing: 1, duration: 0.575, ease: "sine.inOut", yoyo: true, repeat: 1 }, 3.15)
          .add(reveal, 3.3)
          .add(() => (tl = null));
        skipEl?.addEventListener("click", onSkip);
      } else {
        reveal();
        gsap.to(state, { draw: 1, duration: 1.9, delay: 0.25, ease: "power2.inOut", onUpdate: () => (dirty = true) });
        gsap.to(uniforms.uGlow, { value: 0, duration: 0.6, delay: 2.0 });
      }

      // a slow light sweep every few seconds while the hero logo is on screen
      let sweepTween: gsap.core.Tween | null = null;
      if (!reduce) {
        sweepTween = gsap.fromTo(uniforms.uSweep, { value: -0.4 }, { value: 1.6, duration: 2.2, ease: "power1.inOut", repeat: -1, repeatDelay: 5.5, delay: intro ? 4.1 : 3.2 });
      }

      const triggers: ScrollTrigger[] = [];
      const hero = document.getElementById("hero");
      const manifesto = document.getElementById("manifesto");
      const contact = document.getElementById("contact");
      if (hero && manifesto) {
        triggers.push(
          ScrollTrigger.create({
            trigger: hero,
            start: "top top",
            endTrigger: manifesto,
            end: "center center",
            scrub: reduce ? false : 0.6,
            onUpdate: (st) => {
              state.heroP = st.progress;
              dirty = true;
            },
          })
        );
      }
      if (contact) {
        triggers.push(
          ScrollTrigger.create({
            trigger: contact,
            start: "top 90%",
            end: "top 20%",
            scrub: reduce ? false : 0.8,
            onUpdate: (st) => {
              state.contactP = st.progress;
              dirty = true;
            },
          })
        );
      }

      const form = document.querySelector<HTMLElement>(".cform");
      if (form) {
        triggers.push(
          ScrollTrigger.create({
            trigger: form,
            start: "top 88%",
            end: "top 40%",
            scrub: reduce ? false : 0.6,
            onUpdate: (st) => {
              state.formP = st.progress;
              dirty = true;
            },
          })
        );
      }

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
      };
      if (finePointer && !reduce) window.addEventListener("pointermove", onPointer, { passive: true });
      const onScroll = () => {
        if (L.mobile) dirty = true;
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      const timer = new THREE.Timer();
      let raf = 0;
      let visible = !document.hidden;
      const onVis = () => {
        visible = !document.hidden;
        if (visible) loop();
      };
      document.addEventListener("visibilitychange", onVis);

      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      const apply = (t: number) => {
        const inContact = !L.mobile && state.contactP > 0.001 && state.k >= 1;
        let draw = state.draw;
        let start = 0;
        let x: number, y: number, s: number, rotX: number, rotY: number;
        if (inContact) {
          const q = state.contactP;
          draw = reduce ? (state.formP > 0.5 ? 0 : 1) : smooth(0, 0.85, q);
          start = reduce ? 0 : smooth(0, 1, state.formP);
          const p = L.hero;
          x = p.x;
          s = p.s * 0.92;
          y = p.y - (1 - q) * 0.6;
          rotY = sign * (0.55 - 0.7 * q);
          rotX = 0.16 - 0.2 * q;
        } else {
          const p = state.heroP;
          const k = state.k;
          x = lerp(L.intro.x, L.hero.x, k);
          y = lerp(L.intro.y, L.hero.y, k);
          s = lerp(L.intro.s, L.hero.s, k);
          start = reduce ? 0 : L.mobile ? smooth(0.12, 0.5, p) : smooth(0.24, 0.72, p);
          if (reduce && p > 0.45) draw = 0;
          rotY = sign * (0.85 * p + state.swing * 0.32) - (1 - k) * 0.0;
          rotX = 0.3 * p - state.swing * 0.08;
          x *= 1 + 0.05 * p;
          y = L.mobile ? y + window.scrollY * L.wpp : y + p * 1.5;
          s *= 1 - 0.12 * p;
        }
        uniforms.uDraw.value = draw;
        uniforms.uStart.value = start;
        outer.position.set(x, y, 0);
        outer.scale.setScalar(s);
        outer.rotation.set(rotX, rotY, 0);

        if (!reduce) {
          pointer.x += (pointer.tx - pointer.x) * 0.06;
          pointer.y += (pointer.ty - pointer.y) * 0.06;
          inner.rotation.y = pointer.x * 0.2;
          inner.rotation.x = pointer.y * 0.14;
          inner.position.y = Math.sin(t * 0.8) * 0.035;
          inner.rotation.z = Math.sin(t * 0.5) * 0.01;
          uniforms.uLight.value.set(pointer.x, -pointer.y);
          uniforms.uTime.value = t;
        }
        shadowUniforms.uOpacity.value = 0.16 * (inContact ? 1 : 1 - smooth(0, 0.3, state.heroP));
        return Math.max(0, draw - start);
      };

      let firstFrame = true;
      const loop = () => {
        cancelAnimationFrame(raf);
        if (disposed || !visible) return;
        timer.update();
        const visibleAmount = apply(timer.getElapsed());
        if (visibleAmount > 0.001 || dirty) {
          renderer.render(scene, camera);
          if (firstFrame) {
            firstFrame = false;
            canvas.dataset.ready = "true";
          }
        }
        dirty = reduce ? false : visibleAmount > 0.001;
        raf = requestAnimationFrame(loop);
      };

      window.addEventListener("resize", resize);
      resize();
      setPct();
      loop();
      canvas.dataset.ready = "true";

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVis);
        skipEl?.removeEventListener("click", onSkip);
        triggers.forEach((tr) => tr.kill());
        tl?.kill();
        sweepTween?.kill();
        geometry.dispose();
        material.dispose();
        shadowMat.dispose();
        tex.dispose();
        map.dispose();
        renderer.dispose();
      };
    })().catch(fail);

    return () => {
      disposed = true;
      cleanup();
    };
  }, [dir]);

  return <canvas ref={canvasRef} className="ribbon-canvas" aria-hidden="true" />;
}

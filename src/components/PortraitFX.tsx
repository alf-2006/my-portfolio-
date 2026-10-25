"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * About-section portrait.
 * The <Image> is the real content (SEO, no-JS, reduced motion, no WebGL).
 * When WebGL is available a shader takes over the same pixels:
 *   - on enter: the photo forms from the bottom through a moving noise front
 *     that burns blue → yellow, while liquid + glitch distortion, zoom,
 *     RGB split and a brand duotone settle into the untouched photo;
 *   - on hover: 3D tilt towards the pointer, a soft lens + ripple + glare;
 *   - on scroll: small inner parallax and a velocity-driven wave.
 */

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform float uProgress;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform float uVel;
uniform float uScroll;
varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return v;
}
vec2 coverUv(vec2 uv) {
  float rs = uRes.x / uRes.y;
  float ri = uImg.x / uImg.y;
  vec2 s = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  return (uv - 0.5) * s + 0.5;
}
vec3 sampleRGB(vec2 uv, float split) {
  vec2 o = vec2(split, 0.0);
  float r = texture2D(uTex, clamp(uv + o, 0.001, 0.999)).r;
  float g = texture2D(uTex, clamp(uv, 0.001, 0.999)).g;
  float b = texture2D(uTex, clamp(uv - o, 0.001, 0.999)).b;
  return vec3(r, g, b);
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);
  float d = 1.0 - p;
  float d2 = d * d;
  float aspect = uRes.x / uRes.y;
  vec2 uv = vUv;

  // reveal field: rises from the bottom behind an fbm front
  float n = fbm(vUv * vec2(3.0, 3.6) + vec2(0.0, uTime * 0.08));
  float field = vUv.y * 0.62 + n * 0.38;
  float t = mix(-0.04, 1.1, p);
  float mask = 1.0 - smoothstep(t - 0.05, t, field);
  float bx = (field - (t - 0.03)) / 0.026;
  float band = exp(-bx * bx) * clamp(d * 6.0, 0.0, 1.0);

  // liquid + digital glitch that settle as the photo lands
  vec2 w = vec2(fbm(vUv * 4.0 + uTime * 0.25), fbm(vUv * 4.0 + 9.2 - uTime * 0.25)) - 0.5;
  uv += w * 0.14 * d2;
  float slice = floor(vUv.y * 46.0);
  float tick = floor(uTime * 14.0);
  float g = step(0.78, hash(vec2(slice, tick)));
  uv.x += (hash(vec2(slice * 1.7, tick)) - 0.5) * 0.12 * g * d2;

  // zoom from close-up to rest (rest keeps 4% headroom for the parallax)
  float zoom = 1.04 + 0.32 * d2;
  uv = (uv - 0.5) / zoom + 0.5;
  uv.y += uScroll * 0.018;

  // hover: lens + ripple around the pointer
  vec2 dm = vUv - uMouse;
  dm.x *= aspect;
  float dist = length(dm);
  vec2 dir = dist > 0.0001 ? dm / dist : vec2(0.0);
  float lens = exp(-dist * dist * 14.0) * uHover;
  uv -= vec2(dm.x / aspect, dm.y) * lens * 0.07;
  float ripple = sin(dist * 34.0 - uTime * 5.0) * exp(-dist * 4.5) * uHover;
  uv += vec2(dir.x / aspect, dir.y) * ripple * 0.0045;

  // scroll-velocity wave
  uv.x += sin(vUv.y * 9.0 + uTime * 3.0) * uVel * 0.012;

  float split = 0.016 * d2 + 0.0035 * uHover + abs(uVel) * 0.01;
  vec3 col = sampleRGB(coverUv(uv), split);

  // brand duotone while forming
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  vec3 duo = mix(vec3(0.03, 0.07, 0.25), vec3(0.2, 0.4, 1.0), lum);
  col = mix(col, duo, 0.8 * (1.0 - smoothstep(0.5, 1.0, p)));
  // scanlines while forming
  col *= 1.0 - 0.12 * d * (0.5 + 0.5 * sin(vUv.y * uRes.y * 1.4));
  // burning front: blue core, yellow rim
  vec3 edge = mix(vec3(0.2, 0.4, 1.0), vec3(0.98, 0.75, 0.14), smoothstep(0.3, 1.0, band));
  col = mix(col, edge, band * 0.8) + edge * band * 0.3;
  // hover glare
  col += vec3(1.0) * exp(-dist * dist * 9.0) * uHover * 0.08;

  gl_FragColor = vec4(col * mask, mask);
}
`;

type Props = { src: string; alt: string; width: number; height: number };

export default function PortraitFX({ src, alt, width, height }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const uniforms = {
      uTex: { value: null as THREE.Texture | null },
      uRes: { value: new THREE.Vector2(1, 1) },
      uImg: { value: new THREE.Vector2(width, height) },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uVel: { value: 0 },
      uScroll: { value: 0 },
    };
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, premultipliedAlpha: true, depthTest: false, depthWrite: false });
    scene.add(new THREE.Mesh(geo, mat));

    let dirty = true;
    let ready = false;
    let disposed = false;
    let visible = false;
    let raf = 0;
    let last = performance.now();
    const mouseT = new THREE.Vector2(0.5, 0.5);
    let hoverT = 0;
    let velT = 0;
    let scrollT = 0;
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    const triggers: ScrollTrigger[] = [];
    let reveal: gsap.core.Tween | null = null;

    // hide the plain photo only while the shader owns it
    el.dataset.fx = "pending";
    const failsafe = window.setTimeout(() => {
      if (!ready) delete el.dataset.fx;
    }, 5000);

    const size = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      renderer.setSize(r.width, r.height, false);
      uniforms.uRes.value.set(r.width, r.height);
      dirty = true;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = 1 - Math.exp(-dt * 6);
      uniforms.uHover.value += (hoverT - uniforms.uHover.value) * k;
      uniforms.uMouse.value.lerp(mouseT, Math.min(1, k * 1.6));
      velT *= Math.exp(-dt * 4);
      uniforms.uVel.value += (velT - uniforms.uVel.value) * k;
      uniforms.uScroll.value += (scrollT - uniforms.uScroll.value) * k;
      tilt.x += (tilt.tx - tilt.x) * k;
      tilt.y += (tilt.ty - tilt.y) * k;
      const tilting = Math.abs(tilt.x - tilt.tx) > 0.01 || Math.abs(tilt.y - tilt.ty) > 0.01 || Math.abs(tilt.x) > 0.01 || Math.abs(tilt.y) > 0.01;
      el.style.transform = tilting ? `perspective(1100px) rotateX(${tilt.x.toFixed(3)}deg) rotateY(${tilt.y.toFixed(3)}deg)` : "";
      const p = uniforms.uProgress.value;
      const active =
        dirty ||
        (p > 0 && p < 1) ||
        uniforms.uHover.value > 0.002 ||
        Math.abs(uniforms.uVel.value) > 0.002 ||
        Math.abs(uniforms.uScroll.value - scrollT) > 0.0005;
      if (!ready || !active) return;
      uniforms.uTime.value += dt;
      renderer.render(scene, camera);
      dirty = false;
    };
    const start = () => {
      if (!raf && !disposed) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      mouseT.set(x, 1 - y);
      hoverT = uniforms.uProgress.value >= 1 ? 1 : 0;
      tilt.tx = -(y - 0.5) * 9;
      tilt.ty = (x - 0.5) * 11;
    };
    const onLeave = () => {
      hoverT = 0;
      tilt.tx = 0;
      tilt.ty = 0;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    const setup = () => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            reveal = gsap.to(uniforms.uProgress, {
              value: 1,
              duration: 2.6,
              ease: "sine.inOut",
              onComplete: () => {
                el.dataset.revealed = "true";
                dirty = true;
              },
            });
          },
        }),
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (st) => {
            scrollT = st.progress * 2 - 1;
            velT = Math.max(-1, Math.min(1, st.getVelocity() / 2500));
          },
        })
      );
      ScrollTrigger.refresh();
    };

    const loader = new THREE.TextureLoader();
    loader.load(
      src,
      (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.NoColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
        uniforms.uTex.value = tex;
        const img = tex.image as { width?: number; height?: number } | undefined;
        if (img?.width && img?.height) uniforms.uImg.value.set(img.width, img.height);
        ready = true;
        dirty = true;
        el.dataset.fx = "on";
        setup();
        if (visible) start();
      },
      undefined,
      () => {
        delete el.dataset.fx;
      }
    );

    return () => {
      disposed = true;
      window.clearTimeout(failsafe);
      stop();
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      triggers.forEach((t) => t.kill());
      reveal?.kill();
      uniforms.uTex.value?.dispose();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      el.style.transform = "";
      delete el.dataset.fx;
      delete el.dataset.revealed;
    };
  }, [src, width, height]);

  return (
    <div ref={wrapRef} className="portrait">
      <Image className="portrait__img" src={src} alt={alt} width={width} height={height} sizes="(min-width: 960px) 34vw, 86vw" quality={90} />
      <canvas ref={canvasRef} className="portrait__fx" aria-hidden="true" />
    </div>
  );
}

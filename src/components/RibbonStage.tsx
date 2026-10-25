"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed full-screen WebGL stage for the ALF ribbon.
 * Hero: the ribbon writes itself in, then turns and un-writes as you scroll into the manifesto.
 * Contact: it writes itself back in as the closing bookend.
 * Everything else covers it with opaque sections, and rendering pauses when it isn't visible.
 */
export default function RibbonStage({ dir }: { dir: "ltr" | "rtl" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const probe = document.createElement("canvas");
      const gl = probe.getContext("webgl2") || probe.getContext("webgl");
      if (!gl) {
        document.documentElement.classList.add("no-webgl");
        return;
      }

      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const { buildRibbonGeometry, createRibbonMaterial, RIBBON_BOUNDS } = await import("./three/ribbon");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (disposed) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const rtl = dir === "rtl";

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        document.documentElement.classList.add("no-webgl");
        return;
      }
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 0.92;
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      const key = new THREE.DirectionalLight(0xffffff, 2.4);
      key.position.set(4, 6, 8);
      const rim = new THREE.DirectionalLight(0xb8ccff, 2.2);
      rim.position.set(-6, 3, -5);
      const warm = new THREE.DirectionalLight(0xffe2a8, 0.6);
      warm.position.set(5, -4, 4);
      scene.add(key, rim, warm, new THREE.AmbientLight(0xffffff, 0.18));

      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      camera.position.set(0, 0, 18);

      const geometry = buildRibbonGeometry();
      const { material, uniforms } = createRibbonMaterial();
      const mesh = new THREE.Mesh(geometry, material);

      // soft contact shadow under the ribbon
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = shadowCanvas.height = 128;
      const sctx = shadowCanvas.getContext("2d")!;
      const grad = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(31,63,168,0.22)");
      grad.addColorStop(1, "rgba(31,63,168,0)");
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 128, 128);
      const shadowTex = new THREE.CanvasTexture(shadowCanvas);
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(RIBBON_BOUNDS.width * 0.95, 1.1),
        new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
      );
      shadow.rotation.x = -Math.PI / 2.2;
      shadow.position.set(0, -RIBBON_BOUNDS.height / 2 - 0.55, -0.2);

      const inner = new THREE.Group(); // idle + pointer
      inner.add(mesh, shadow);
      const outer = new THREE.Group(); // scroll-driven pose
      outer.add(inner);
      scene.add(outer);

      // ── layout ────────────────────────────────────────────────
      const layout = { x: 0, y: 0, s: 1, mobile: false, wpp: 0.01 };
      const computeLayout = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const aspect = w / h;
        const visH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const visW = visH * aspect;
        layout.wpp = visH / h;
        if (w >= 900 && aspect > 1.05) {
          layout.mobile = false;
          layout.s = Math.min(1.25, (visW * 0.41) / RIBBON_BOUNDS.width, (visH * 0.48) / RIBBON_BOUNDS.height);
          const half = (RIBBON_BOUNDS.width * layout.s) / 2;
          layout.x = (visW / 2 - half - visW * 0.05) * (rtl ? -1 : 1);
          layout.y = visH * 0.04;
        } else {
          layout.mobile = true;
          layout.s = Math.min((visW * 0.84) / RIBBON_BOUNDS.width, (visH * 0.26) / RIBBON_BOUNDS.height);
          layout.x = 0;
          const headerUnits = (72 / h) * visH;
          layout.y = visH / 2 - headerUnits - (RIBBON_BOUNDS.height * layout.s) / 2 - visH * 0.05;
        }
      };

      const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, w < 900 ? 1.5 : 2);
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        computeLayout();
        dirty = true;
      };

      // ── state driven by scroll / intro ───────────────────────
      const state = { intro: reduce ? 1 : 0, heroP: 0, contactP: 0 };
      let dirty = true;

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

      const smooth = (a: number, b: number, x: number) => {
        const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
        return t * t * (3 - 2 * t);
      };

      let introTween: gsap.core.Tween | null = null;
      if (!reduce) {
        introTween = gsap.to(state, {
          intro: 1,
          duration: 2.6,
          delay: 0.35,
          ease: "power2.inOut",
          onUpdate: () => {
            dirty = true;
          },
        });
      }

      // ── pointer ──────────────────────────────────────────────
      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
      };
      if (finePointer && !reduce) window.addEventListener("pointermove", onPointer, { passive: true });

      const onScroll = () => {
        if (layout.mobile) dirty = true;
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      const sign = rtl ? -1 : 1;
      const timer = new THREE.Timer();
      let raf = 0;
      let visible = !document.hidden;
      const onVis = () => {
        visible = !document.hidden;
        if (visible) loop();
      };
      document.addEventListener("visibilitychange", onVis);

      let shadowFade = 1;
      const apply = (t: number) => {
        const inContact = !layout.mobile && state.contactP > 0.001;
        let draw: number;
        let start = 0;
        let rotY: number;
        let rotX: number;
        let x = layout.x;
        let y = layout.y;
        let s = layout.s;
        if (inContact) {
          const q = state.contactP;
          draw = reduce ? 1 : smooth(0, 0.85, q);
          rotY = sign * (0.75 - 1.05 * q) - 0.12 * sign;
          rotX = 0.18 - 0.22 * q;
          y = layout.y + (1 - q) * -0.8;
        } else {
          const p = state.heroP;
          draw = reduce ? (p < 0.4 ? 1 : 0) : state.intro;
          start = reduce ? 0 : layout.mobile ? smooth(0.12, 0.5, p) : smooth(0.26, 0.74, p);
          rotY = sign * (-0.38 + 0.95 * p) + (1 - state.intro) * 0.35 * sign;
          rotX = -0.06 + 0.32 * p;
          x = layout.x * (1 + 0.06 * p);
          // mobile: the ribbon travels with the page so it never sits over the text below it
          y = layout.mobile ? layout.y + window.scrollY * layout.wpp : layout.y + p * 1.6;
          s = layout.s * (1 - 0.1 * p);
        }
        shadowFade = inContact ? 1 : 1 - smooth(0, 0.35, state.heroP);
        uniforms.uDraw.value = draw;
        uniforms.uStart.value = start;
        draw = Math.max(0, draw - start);
        outer.position.set(x, y, 0);
        outer.scale.setScalar(s);
        outer.rotation.set(rotX, rotY, 0);

        if (!reduce) {
          pointer.x += (pointer.tx - pointer.x) * 0.06;
          pointer.y += (pointer.ty - pointer.y) * 0.06;
          inner.rotation.y = pointer.x * 0.16;
          inner.rotation.x = pointer.y * 0.1;
          inner.position.y = Math.sin(t * 0.7) * 0.06;
          inner.rotation.z = Math.sin(t * 0.45) * 0.012;
        }
        shadow.visible = draw > 0.2 && shadowFade > 0.01;
        (shadow.material as InstanceType<typeof THREE.MeshBasicMaterial>).opacity = Math.min(1, draw * 1.2) * shadowFade;
        return draw;
      };

      let firstFrame = true;
      const loop = () => {
        cancelAnimationFrame(raf);
        if (disposed || !visible) return;
        timer.update();
        const t = timer.getElapsed();
        const draw = apply(t);
        const animating = !reduce && draw > 0.001;
        if (draw > 0.001 && (animating || dirty)) {
          renderer.render(scene, camera);
          if (firstFrame) {
            firstFrame = false;
            canvas.dataset.ready = "true";
          }
        } else if (draw <= 0.001 && dirty) {
          renderer.clear();
        }
        dirty = false;
        raf = requestAnimationFrame(loop);
      };

      window.addEventListener("resize", resize);
      resize();
      loop();
      if (reduce) canvas.dataset.ready = "true";

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVis);
        triggers.forEach((tr) => tr.kill());
        introTween?.kill();
        geometry.dispose();
        material.dispose();
        shadowTex.dispose();
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [dir]);

  return <canvas ref={canvasRef} className="ribbon-canvas" aria-hidden="true" />;
}

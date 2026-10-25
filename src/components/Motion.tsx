"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __motionReady?: boolean;
    __lenis?: unknown;
  }
}

/** Smooth scroll + every scroll-linked animation outside the 3D stage. */
export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup = () => {};

    const keysOn = () => document.querySelectorAll(".key").forEach((k) => k.setAttribute("data-on", "true"));

    if (reduce || !root.classList.contains("js-motion")) {
      root.classList.remove("js-motion");
      keysOn();
      window.__motionReady = true;
      return;
    }

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const Lenis = (await import("lenis")).default;
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      window.__motionReady = true;

      const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -76 }, autoRaf: false });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        // ── Hero intro ──
        const heroTl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
        heroTl
          .fromTo(".hero [data-hero='top']", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 })
          .fromTo(".hero .line-mask > span", { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.15, stagger: 0.12 }, "-=0.55")
          .add(() => document.querySelector(".hero .key")?.setAttribute("data-on", "true"), "-=0.5")
          .fromTo(".hero [data-hero='rest']", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, "-=0.75");
        // the hero waits for the logo intro (first visit of the session), then plays
        if (root.classList.contains("is-intro") && !window.__introRevealed) {
          lenis.stop();
          const onReveal = () => {
            lenis.start();
            heroTl.play();
          };
          window.addEventListener("alf:intro-reveal", onReveal, { once: true });
        } else {
          gsap.delayedCall(0.15, () => heroTl.play());
        }

        // ── Generic reveals ──
        ScrollTrigger.batch("[data-reveal]", {
          start: "top 88%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.95, ease: "power3.out", stagger: 0.08, overwrite: true }),
        });

        // ── Manifesto: words light up with scroll ──
        const words = gsap.utils.toArray<HTMLElement>(".manifesto .mw");
        if (words.length) {
          gsap.to(words, {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: ".manifesto__text", start: "top 78%", end: "bottom 42%", scrub: 0.4 },
          });
        }

        // ── Contact key underline ──
        ScrollTrigger.create({
          trigger: ".contact__title",
          start: "top 75%",
          once: true,
          onEnter: () => document.querySelector(".contact .key")?.setAttribute("data-on", "true"),
        });

        // ── About: stats count up once, the portrait drifts a little slower than the page ──
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count) || 0;
          const o = { v: 0 };
          el.textContent = "0";
          ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () =>
              gsap.to(o, {
                v: target,
                duration: 1.6,
                ease: "power2.out",
                onUpdate: () => (el.textContent = String(Math.round(o.v))),
              }),
          });
        });
        const mm = gsap.matchMedia();

        // ── Process: pinned walk-through on large screens ──
        mm.add("(min-width: 1100px) and (min-height: 680px)", () => {
          const steps = gsap.utils.toArray<HTMLElement>(".process .step");
          const list = document.querySelector<HTMLElement>(".process .steps");
          const line = document.querySelector<HTMLElement>(".process .steps__line");
          if (!steps.length || !list) return;
          list.dataset.mode = "pin";
          const setActive = (i: number) => steps.forEach((s, k) => s.setAttribute("data-active", k === i ? "true" : "false"));
          setActive(0);
          const st = ScrollTrigger.create({
            trigger: ".process__pin",
            start: "top top",
            end: () => "+=" + window.innerHeight * 2.4,
            pin: true,
            scrub: true,
            onUpdate: (self) => {
              const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
              setActive(i);
              line?.style.setProperty("--progress", String(Math.min(1, self.progress * 1.12)));
            },
          });
          return () => {
            st.kill();
            delete list.dataset.mode;
            steps.forEach((s) => s.removeAttribute("data-active"));
          };
        });
        mm.add("(max-width: 1099px), (max-height: 679px)", () => {
          const steps = gsap.utils.toArray<HTMLElement>(".process .step");
          const sts = steps.map((s) =>
            ScrollTrigger.create({
              trigger: s,
              start: "top 62%",
              end: "bottom 38%",
              onToggle: (self) => s.setAttribute("data-active", self.isActive ? "true" : "false"),
            })
          );
          return () => sts.forEach((t) => t.kill());
        });

        // ── Projects: stacked cards recede ──
        mm.add("(min-width: 960px)", () => {
          const cards = gsap.utils.toArray<HTMLElement>(".projects .project");
          const tweens = cards.slice(0, -1).map((card, i) =>
            gsap.to(card, {
              scale: 0.93,
              "--dim": 0.6,
              ease: "none",
              scrollTrigger: {
                trigger: cards[i + 1],
                start: "top bottom",
                end: () => `top ${76 + 16 + (i + 1) * 14}px`,
                scrub: true,
              },
            })
          );
          return () => tweens.forEach((t) => t.scrollTrigger?.kill());
        });

        // ── Visual frames settle into place ──
        gsap.utils.toArray<HTMLElement>(".project__visual > *").forEach((el) => {
          gsap.fromTo(
            el,
            { rotateX: 14, y: 50, transformPerspective: 1200, transformOrigin: "50% 100%" },
            { rotateX: 0, y: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "center 60%", scrub: 0.5 } }
          );
        });

        // ── RAFIQ voice pipeline: lights travel while in view ──
        const pipe = gsap.utils.toArray<HTMLElement>(".pipeline__step");
        if (pipe.length) {
          const tl = gsap.timeline({ repeat: -1, paused: true });
          pipe.forEach((p) => {
            tl.call(() => p.setAttribute("data-on", "true")).to({}, { duration: 0.55 }).call(() => p.setAttribute("data-on", "false"));
          });
          tl.to({}, { duration: 0.6 });
          ScrollTrigger.create({ trigger: ".pipeline", start: "top 85%", end: "bottom 15%", onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) });
        }

        // ── Wasla parallax ──
        gsap.to(".wasla__sun", { yPercent: 40, ease: "none", scrollTrigger: { trigger: "#wasla", start: "top bottom", end: "bottom top", scrub: true } });
        gsap.to(".wasla__ring", { yPercent: 20, rotate: 25, ease: "none", scrollTrigger: { trigger: "#wasla", start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(".wasla__title span", { xPercent: 8 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: "#wasla", start: "top bottom", end: "top 20%", scrub: true } });
      });

      document.fonts?.ready.then(() => !disposed && ScrollTrigger.refresh());
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      cleanup = () => {
        window.removeEventListener("load", onLoad);
        ctx.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
        window.__lenis = undefined;
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return null;
}

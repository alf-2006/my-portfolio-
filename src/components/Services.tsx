"use client";

import { Bot, ChevronLeft, ChevronRight, Cpu, FileSearch, Globe, Laptop, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary, Service } from "@/content/site";

const ICONS: Record<Service["icon"], typeof Bot> = {
  agent: Bot,
  rag: FileSearch,
  web: Globe,
  desktop: Laptop,
  shield: ShieldCheck,
  iot: Cpu,
};

export default function Services({ s, dir }: { s: Dictionary["services"]; dir: "ltr" | "rtl" }) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const inView = useRef(false);
  const rtl = dir === "rtl";

  const cards = () => Array.from(track.current?.children ?? []) as HTMLElement[];

  const go = useCallback((i: number) => {
    const el = track.current;
    const list = cards();
    if (!el || !list.length) return;
    const n = (i + list.length) % list.length;
    const card = list[n];
    const box = el.getBoundingClientRect();
    const r = card.getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(el).paddingInlineStart) || 0;
    const delta = rtl ? r.right - (box.right - pad) : r.left - (box.left + pad);
    el.scrollBy({ left: delta, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [rtl]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const box = el.getBoundingClientRect();
      const pad = parseFloat(getComputedStyle(el).paddingInlineStart) || 0;
      let best = 0;
      let bestD = Infinity;
      cards().forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs(rtl ? box.right - pad - r.right : r.left - (box.left + pad));
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      // at the far end of the track the last card can't reach the start edge
      const atEnd = rtl ? Math.abs(el.scrollLeft) + el.clientWidth >= el.scrollWidth - 4 : el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      setActive(atEnd ? cards().length - 1 : best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [rtl]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (paused.current || !inView.current || document.hidden) return;
      go(active + 1);
    }, 4200);
    return () => window.clearInterval(id);
  }, [active, go]);

  const Prev = rtl ? ChevronRight : ChevronLeft;
  const Next = rtl ? ChevronLeft : ChevronRight;

  return (
    <div
      className="svc"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
      onTouchStart={() => (paused.current = true)}
    >
      <ul ref={track} className="svc__track" aria-label={s.title}>
        {s.items.map((it, i) => {
          const Icon = ICONS[it.icon];
          return (
            <li key={it.title} className="svc__card" data-active={i === active || undefined} aria-roledescription="slide" aria-label={`${i + 1} / ${s.items.length}`}>
              <div className="svc__top">
                <span className="svc__icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <span className="svc__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="svc__title">{it.title}</h3>
              <p className="svc__text">{it.text}</p>
              <ul className="svc__tags">
                {it.tags.map((t) => (
                  <li key={t} className="chip" dir="ltr">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <div className="svc__controls">
        <button type="button" className="icon-btn" onClick={() => go(active - 1)} aria-label={s.prev}>
          <Prev size={20} />
        </button>
        <div className="svc__dots">
          {s.items.map((it, i) => (
            <button
              key={it.title}
              type="button"
              className="svc__dot"
              aria-label={`${s.goTo} ${i + 1}`}
              aria-current={i === active || undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button type="button" className="icon-btn" onClick={() => go(active + 1)} aria-label={s.next}>
          <Next size={20} />
        </button>
      </div>
    </div>
  );
}

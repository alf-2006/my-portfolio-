"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

type Labels = { dark: string; light: string };

const KEY = "alf-theme";

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};
const isDarkNow = () => document.documentElement.dataset.theme === "dark";

export default function ThemeToggle({ labels }: { labels: Labels }) {
  const dark = useSyncExternalStore(subscribe, isDarkNow, () => false);

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#070b17" : "#f6f7fb");
  }, [dark]);

  const apply = (next: boolean) => {
    const root = document.documentElement;
    if (next) root.dataset.theme = "dark";
    else delete root.dataset.theme;
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {}
  };

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = !dark;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof document.startViewTransition !== "function" || reduce) return apply(next);
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const vt = document.startViewTransition(() => apply(next));
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  return (
    <button type="button" className="theme-btn" onClick={toggle} aria-label={dark ? labels.light : labels.dark} aria-pressed={dark} title={dark ? labels.light : labels.dark}>
      <Sun className="theme-btn__sun" size={18} aria-hidden="true" />
      <Moon className="theme-btn__moon" size={18} aria-hidden="true" />
    </button>
  );
}

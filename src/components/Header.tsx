"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/site";
import ThemeToggle from "./ThemeToggle";

type Props = Pick<Dictionary, "nav" | "langSwitch" | "talk" | "a11y" | "locale" | "theme">;

export default function Header({ nav, langSwitch, talk, a11y, locale, theme }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const home = locale === "ar" ? "/ar" : "/";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const goingDown = y > last.current;
      setHidden(goingDown && y > window.innerHeight * 0.9);
      last.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (open) {
      lenis?.stop();
      closeRef.current?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        lenis?.start();
      };
    }
  }, [open]);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled || undefined} data-hidden={(hidden && !open) || undefined}>
        <div className="container-x site-header__inner">
          <a href={home} className="brand" aria-label="Ahmed Eid — ALF">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand__logo" src="/brand/alf-logo-800.webp" alt="" width={800} height={449} />
            <span className="brand__name">Ahmed Eid</span>
          </a>
          <nav className="nav" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main"}>
            {nav.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <ThemeToggle labels={theme} />
            <a className="lang-switch" href={langSwitch.href} hrefLang={langSwitch.hrefLang} lang={langSwitch.hrefLang} aria-label={langSwitch.aria}>
              {langSwitch.label}
            </a>
            <a className="btn btn-sm header-talk" href="#contact">
              {talk}
            </a>
            <button className="menu-btn" type="button" aria-label={a11y.menu} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div id="mobile-menu" className="mobile-menu" data-open={open || undefined} role="dialog" aria-modal="true" aria-label={a11y.menu} inert={!open}>
        <button ref={closeRef} className="menu-btn mobile-menu__close" type="button" aria-label={a11y.close} onClick={() => setOpen(false)}>
          <X size={20} aria-hidden="true" />
        </button>
        {nav.map((n) => (
          <a key={n.href} href={n.href} className="mm-link" onClick={() => setOpen(false)}>
            {n.label}
          </a>
        ))}
        <a className="btn" href="#contact" onClick={() => setOpen(false)}>
          {talk}
        </a>
      </div>
    </>
  );
}

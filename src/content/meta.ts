import type { Metadata } from "next";
import { LINKS, type Dictionary } from "./site";

export function buildMetadata(d: Dictionary): Metadata {
  const path = d.locale === "ar" ? "/ar" : "/";
  return {
    metadataBase: new URL(LINKS.site),
    title: d.meta.title,
    description: d.meta.description,
    applicationName: "Ahmed Eid — ALF",
    authors: [{ name: "Ahmed Eid", url: LINKS.site }],
    alternates: { canonical: path, languages: { en: "/", ar: "/ar", "x-default": "/" } },
    openGraph: {
      type: "profile",
      url: path,
      siteName: "Ahmed Eid — ALF",
      title: d.meta.title,
      description: d.meta.description,
      locale: d.locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: d.locale === "ar" ? ["en_US"] : ["ar_EG"],
      images: [{ url: d.locale === "ar" ? "/og-ar.png" : "/og.png", width: 1200, height: 630, alt: d.meta.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: d.meta.title, description: d.meta.description, images: [d.locale === "ar" ? "/og-ar.png" : "/og.png"] },
    robots: { index: true, follow: true },
  };
}

export function personJsonLd(d: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ahmed Eid",
    alternateName: "ALF",
    url: LINKS.site + (d.locale === "ar" ? "/ar" : ""),
    email: `mailto:${LINKS.email}`,
    jobTitle: d.locale === "ar" ? "طالب IT متخصص في الذكاء الاصطناعي" : "AI-focused IT student",
    address: { "@type": "PostalAddress", addressLocality: "Alexandria", addressCountry: "EG" },
    affiliation: { "@type": "CollegeOrUniversity", name: "Borg El Arab Technological University", url: "https://batechu.com/" },
    sameAs: [LINKS.github, LINKS.linkedin, LINKS.youtube, LINKS.facebook, LINKS.telegram],
    knowsAbout: ["Artificial intelligence", "Local LLMs", "Retrieval-augmented generation", "Voice AI", "Full-stack web development", "IoT"],
  };
}

export const MOTION_BOOT = `(function(){try{var d=document.documentElement;try{if(localStorage.getItem('alf-theme')==='dark'){d.dataset.theme='dark';var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content','#070b17')}}catch(e){}if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-motion');var seen=false;try{seen=sessionStorage.getItem('alf-intro-seen')==='1'}catch(e){}if(!seen){d.classList.add('is-intro');setTimeout(function(){if(!window.__introRevealed){window.__introRevealed=true;d.classList.add('intro-done');d.classList.remove('is-intro');window.dispatchEvent(new Event('alf:intro-reveal'))}},9000)}setTimeout(function(){if(!window.__motionReady){d.classList.remove('js-motion');d.classList.remove('is-intro')}},4500)}}catch(e){}})();`;

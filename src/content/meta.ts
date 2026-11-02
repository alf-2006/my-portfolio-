import type { Metadata } from "next";
import { LINKS, type Dictionary } from "./site";

export function buildMetadata(d: Dictionary): Metadata {
  const path = d.locale === "ar" ? "/ar" : "/";
  const isAr = d.locale === "ar";

  const keywords = isAr
    ? [
        "7lf.dev",
        "7lf",
        "أحمد عيد",
        "Ahmed Eid",
        "ALF",
        "Wasla Tech",
        "وصلة تك",
        "مهندس ذكاء اصطناعي",
        "مطور برمجيات",
        "بورتفوليو أحمد عيد",
        "ذكاء اصطناعي الإسكندرية",
        "جامعة برج العرب التكنولوجية",
        "Local LLMs",
        "RAG",
        "Voice AI",
        "Next.js Developer Egypt",
      ]
    : [
        "7lf.dev",
        "7lf",
        "Ahmed Eid",
        "أحمد عيد",
        "ALF",
        "Wasla Tech",
        "AI Engineer",
        "Full Stack Developer",
        "Ahmed Eid Portfolio",
        "Alexandria Egypt",
        "BATU",
        "Borg El Arab Technological University",
        "Local LLMs",
        "RAG",
        "Voice AI",
        "Next.js Developer Egypt",
      ];

  return {
    metadataBase: new URL(LINKS.site),
    title: {
      default: d.meta.title,
      template: "%s | 7lf.dev",
    },
    description: d.meta.description,
    keywords,
    applicationName: "7lf.dev — Ahmed Eid (ALF)",
    authors: [{ name: "Ahmed Eid", url: LINKS.site }],
    creator: "Ahmed Eid (7lf)",
    publisher: "Ahmed Eid",
    category: "technology",
    alternates: {
      canonical: path,
      languages: { en: "/", ar: "/ar", "x-default": "/" },
    },
    openGraph: {
      type: "profile",
      url: path,
      siteName: "7lf.dev | Ahmed Eid (ALF)",
      title: d.meta.title,
      description: d.meta.description,
      locale: isAr ? "ar_EG" : "en_US",
      alternateLocale: isAr ? ["en_US"] : ["ar_EG"],
      images: [
        {
          url: isAr ? "/og-ar.png" : "/og.png",
          width: 1200,
          height: 630,
          alt: d.meta.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: d.meta.title,
      description: d.meta.description,
      creator: "@Zarzor7H",
      images: [isAr ? "/og-ar.png" : "/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    },
  };
}

export function personJsonLd(d: Dictionary) {
  const isAr = d.locale === "ar";
  const currentUrl = `${LINKS.site}${isAr ? "/ar" : ""}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${LINKS.site}/#website`,
        url: LINKS.site,
        name: "7lf.dev",
        alternateName: ["7lf", "Ahmed Eid Portfolio", "بورتفوليو أحمد عيد"],
        description: d.meta.description,
        inLanguage: isAr ? "ar-EG" : "en-US",
        publisher: {
          "@id": `${LINKS.site}/#person`,
        },
      },
      {
        "@type": "ProfilePage",
        "@id": `${currentUrl}#webpage`,
        url: currentUrl,
        name: d.meta.title,
        isPartOf: { "@id": `${LINKS.site}/#website` },
        about: { "@id": `${LINKS.site}/#person` },
        description: d.meta.description,
        inLanguage: isAr ? "ar-EG" : "en-US",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${LINKS.site}${isAr ? "/og-ar.png" : "/og.png"}`,
        },
      },
      {
        "@type": "Person",
        "@id": `${LINKS.site}/#person`,
        name: isAr ? "أحمد عيد" : "Ahmed Eid",
        alternateName: ["7lf", "7lf.dev", "ALF", isAr ? "Ahmed Eid" : "أحمد عيد"],
        url: LINKS.site,
        image: `${LINKS.site}/brand/alf-logo-800.webp`,
        email: `mailto:${LINKS.email}`,
        jobTitle: isAr ? "مهندس ذكاء اصطناعي ومطور برمجيات" : "AI & Full-Stack Engineer",
        gender: "https://schema.org/Male",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Alexandria",
          addressCountry: "EG",
        },
        affiliation: {
          "@type": "CollegeOrUniversity",
          name: "Borg El Arab Technological University (BATU)",
          url: "https://batechu.com/",
        },
        worksFor: {
          "@type": "Organization",
          name: "Wasla Tech",
          url: LINKS.youtube,
        },
        sameAs: [
          LINKS.github,
          LINKS.linkedin,
          LINKS.youtube,
          LINKS.facebook,
          LINKS.telegram,
        ],
        knowsAbout: [
          "Artificial Intelligence",
          "Machine Learning",
          "Local LLMs",
          "Retrieval-Augmented Generation (RAG)",
          "Voice AI",
          "Full-Stack Web Development",
          "Next.js",
          "React",
          "TypeScript",
          "Python",
          "FastAPI",
          "Ollama",
          "IoT",
        ],
      },
    ],
  };
}

export const MOTION_BOOT = `(function(){try{var d=document.documentElement;try{if(localStorage.getItem('alf-theme')==='dark'){d.dataset.theme='dark';var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content','#070b17')}}catch(e){}if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-motion');var seen=false;try{seen=sessionStorage.getItem('alf-intro-seen')==='1'}catch(e){}if(!seen){d.classList.add('is-intro');setTimeout(function(){if(!window.__introRevealed){window.__introRevealed=true;d.classList.add('intro-done');d.classList.remove('is-intro');window.dispatchEvent(new Event('alf:intro-reveal'))}},9000)}setTimeout(function(){if(!window.__motionReady){d.classList.remove('js-motion');d.classList.remove('is-intro')}},4500)}}catch(e){}})();`;

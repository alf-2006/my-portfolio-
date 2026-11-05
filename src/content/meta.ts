import type { Metadata } from "next";
import { LINKS, type Dictionary } from "./site";

export function buildMetadata(d: Dictionary): Metadata {
  const path = d.locale === "ar" ? "/ar" : "/";
  const isAr = d.locale === "ar";
  const canonicalUrl = isAr ? `${LINKS.site}/ar` : LINKS.site;

  const keywords = isAr
    ? [
        "7lf.dev",
        "7lf",
        "أحمد عيد",
        "Ahmed Eid",
        "Alfanan",
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
        "Alfanan",
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
      template: "%s | 7lf — Ahmed Eid",
    },
    description: d.meta.description,
    keywords,
    applicationName: "7lf — Ahmed Eid",
    authors: [{ name: "Ahmed Eid (7lf)", url: LINKS.site }],
    creator: "7lf — Ahmed Eid",
    publisher: "7lf — Ahmed Eid",
    category: "technology",
    manifest: "/site.webmanifest",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: LINKS.site,
        ar: `${LINKS.site}/ar`,
        "x-default": LINKS.site,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
        { url: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon.png", sizes: "192x192", type: "image/png" },
      ],
      shortcut: [{ url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "7lf — Ahmed Eid",
      title: d.meta.title,
      description: d.meta.description,
      locale: isAr ? "ar_EG" : "en_US",
      alternateLocale: isAr ? ["en_US"] : ["ar_EG"],
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: d.meta.ogAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Zarzor7H",
      creator: "@Zarzor7H",
      title: d.meta.title,
      description: d.meta.description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: d.meta.ogAlt,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
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
  const currentUrl = isAr ? `${LINKS.site}/ar` : `${LINKS.site}/`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${LINKS.site}/#website`,
        name: "7lf — Ahmed Eid",
        alternateName: ["7lf", "Ahmed Eid", "Alfanan"],
        url: `${LINKS.site}/`,
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
        description: d.meta.description,
        inLanguage: isAr ? "ar-EG" : "en-US",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${LINKS.site}/og-image.png`,
          width: 1200,
          height: 630,
        },
        mainEntity: {
          "@type": "Person",
          "@id": `${LINKS.site}/#person`,
          name: "Ahmed Eid",
          alternateName: "7lf",
          jobTitle: "AI Engineer & Full-Stack Developer",
          url: `${LINKS.site}/`,
          image: `${LINKS.site}/og-image.png`,
          email: `mailto:${LINKS.email}`,
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
      },
    ],
  };
}

export const MOTION_BOOT = `(function(){try{var d=document.documentElement;try{if(localStorage.getItem('alf-theme')==='dark'){d.dataset.theme='dark';var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content','#070b17')}}catch(e){}var isBot=typeof navigator!=='undefined'&&/bot|googlebot|crawler|spider|robot|crawling|lighthouse/i.test(navigator.userAgent);if(!isBot&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-motion');var seen=false;try{seen=sessionStorage.getItem('alf-intro-seen')==='1'}catch(e){}if(!seen){d.classList.add('is-intro');setTimeout(function(){if(!window.__introRevealed){window.__introRevealed=true;d.classList.add('intro-done');d.classList.remove('is-intro');window.dispatchEvent(new Event('alf:intro-reveal'))}},9000)}setTimeout(function(){if(!window.__motionReady){d.classList.remove('js-motion');d.classList.remove('is-intro')}},4500)}}catch(e){}})();`;

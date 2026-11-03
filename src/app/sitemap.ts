import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://7lf.dev";
  const lastModified = new Date("2026-11-01T00:00:00.000Z");
  const languages = {
    en: base,
    ar: `${base}/ar`,
    "x-default": base,
  };

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: { languages },
    },
    {
      url: `${base}/ar`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages },
    },
  ];
}

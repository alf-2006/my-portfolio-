import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://7lf.vercel.app";
  const languages = { en: `${base}/`, ar: `${base}/ar` };
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: `${base}/ar`, changeFrequency: "monthly", priority: 0.9, alternates: { languages } },
  ];
}

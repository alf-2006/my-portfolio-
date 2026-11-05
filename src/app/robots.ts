import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: ["Googlebot", "Googlebot-Image"],
        allow: "/",
      },
    ],
    sitemap: "https://7lf.dev/sitemap.xml",
    host: "https://7lf.dev",
  };
}

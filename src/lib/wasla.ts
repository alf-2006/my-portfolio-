import { cacheLife } from "next/cache";

export type Video = { id: string; title: string; published: string; views?: number };

const CHANNEL_ID = "UCKRNbbY_S5_h7nRwHUTAE5A"; // @wasla_tech_official
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

// Snapshot (25 Oct 2026) used only if YouTube can't be reached at build/revalidate time.
const FALLBACK: Video[] = [
  { id: "LQ8m2Q5bKQg", title: "المراجعة النهائية الشاملة لنظام التشغيل Linux (Ubuntu) | حل جميع الشيتات والأوامر", published: "2026-10-23", views: 313 },
  { id: "G_lMrYMW5og", title: "Digital Engineering Part 2 🔴 | شرح الـ 7 Logic Gates بالعربي للمبتدئين", published: "2026-10-23", views: 296 },
  { id: "dGOky86hujw", title: "Digital Engineering Explained | شرح الـ 7 Logic Gates بالعربي", published: "2026-10-22", views: 400 },
  { id: "EwKoXxV5bm0", title: "كورس JavaScript من الصفر #01 | ما هي JavaScript؟ التاريخ والنشأة و ECMAScript", published: "2026-10-10", views: 69 },
  { id: "aMMciGqeFqQ", title: "الإيميل الموحد مش مجرد إيميل! اعرف الإيميل والباسورد واستخدم حسابك صح", published: "2026-09-18", views: 226 },
  { id: "F0Q1PMl7_u0", title: "Online AI vs Offline AI | دليلك لفهم عالم الـ AI من البداية — Session 1", published: "2026-07-21", views: 97 },
];

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

export async function getWaslaVideos(limit = 6): Promise<Video[]> {
  "use cache";
  cacheLife("days");
  try {
    const res = await fetch(FEED, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(String(res.status));
    const xml = await res.text();
    const videos = xml
      .split("<entry>")
      .slice(1)
      .map((e) => ({
        id: e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "",
        title: decode(e.match(/<title>([^<]*)<\/title>/)?.[1] ?? ""),
        published: (e.match(/<published>([^<]+)<\/published>/)?.[1] ?? "").slice(0, 10),
        views: Number(e.match(/<media:statistics views="(\d+)"/)?.[1] ?? NaN) || undefined,
      }))
      .filter((v) => /^[\w-]{11}$/.test(v.id) && v.title);
    return videos.length ? videos.slice(0, limit) : FALLBACK.slice(0, limit);
  } catch {
    return FALLBACK.slice(0, limit);
  }
}

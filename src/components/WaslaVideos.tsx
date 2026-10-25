import { ArrowUpRight, Play } from "lucide-react";
import type { Dictionary } from "@/content/site";
import { getWaslaVideos } from "@/lib/wasla";

export default async function WaslaVideos({ d, channel }: { d: Dictionary; channel: string }) {
  const videos = await getWaslaVideos(3);
  const ar = d.locale === "ar";
  const fmt = new Intl.DateTimeFormat(ar ? "ar-EG" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  const num = new Intl.NumberFormat(ar ? "ar-EG" : "en");
  return (
    <div className="vids">
      <div className="vids__head">
        <div>
          <h3 className="vids__title">{d.videos.title}</h3>
          <p className="vids__sub">{d.videos.sub}</p>
        </div>
        <a className="vids__all" href={channel} target="_blank" rel="noopener noreferrer">
          {d.videos.all}
          <ArrowUpRight size={16} aria-hidden="true" />
          <span className="sr-only"> {d.a11y.opensNew}</span>
        </a>
      </div>
      <ul className="vids__grid">
        {videos.map((v) => (
          <li key={v.id} className="vid" data-reveal>
            <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer">
              <span className="vid__thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" width={480} height={360} loading="lazy" decoding="async" />
                <span className="vid__play" aria-hidden="true">
                  <Play size={18} fill="currentColor" />
                </span>
              </span>
              <span className="vid__name" dir="auto">
                {v.title}
              </span>
              <span className="vid__meta">
                {fmt.format(new Date(v.published))}
                {v.views ? ` · ${num.format(v.views)} ${d.videos.views}` : ""}
              </span>
              <span className="sr-only"> {d.a11y.opensNew}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import Markdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import "./project-showcase.css";

export default function ProjectReadme({ markdown, sourceUrl, opensNew }: { markdown: string; sourceUrl: string; opensNew: string }) {
  return (
    <div className="project-showcase__readme" dir="auto">
      <Markdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        urlTransform={(url) => {
          const safe = defaultUrlTransform(url);
          if (!safe) return "";
          try {
            const resolved = new URL(safe, sourceUrl);
            return ["https:", "http:", "mailto:"].includes(resolved.protocol) ? resolved.href : "";
          } catch { return ""; }
        }}
        components={{
          img: () => null,
          a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only"> {opensNew}</span></a>,
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}

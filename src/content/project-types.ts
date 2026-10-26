export type LocalizedProjectText = string | { en?: string; ar?: string };

export type ProjectMedia = {
  type: "image" | "video" | "youtube";
  src: string;
  alt: LocalizedProjectText;
  caption?: LocalizedProjectText;
  poster?: string;
  captions?: { src: string; language: string; label: string }[];
};

export type ProjectDetails = {
  repository: string;
  title: LocalizedProjectText | null;
  summary: LocalizedProjectText | null;
  highlights: LocalizedProjectText[];
  media: ProjectMedia[];
  readme: string | null;
  readmeUrl: string | null;
  languages: string[];
  source: "manifest" | "readme" | "repository";
};

export function projectText(value: LocalizedProjectText | null | undefined, locale: "en" | "ar"): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale] || value.en || value.ar || "";
}

import { cacheLife } from "next/cache";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import showcaseManifest from "../../content/project-showcases.json";
import { getGitHubRepositories, type GitHubRepository } from "./github";
import type { LocalizedProjectText, ProjectDetails, ProjectMedia } from "./project-types";

type UnknownRecord = Record<string, unknown>;
type AstNode = {
  type: string;
  value?: string;
  children?: AstNode[];
  url?: string;
  title?: string | null;
  alt?: string | null;
  depth?: number;
  ordered?: boolean;
  attributes?: Record<string, string>;
  identifier?: string;
};

type ReadmePayload = {
  content?: unknown;
  encoding?: unknown;
  html_url?: unknown;
  path?: unknown;
  download_url?: unknown;
};

type ManifestProject = {
  title: LocalizedProjectText | null;
  summary: LocalizedProjectText | null;
  highlights: LocalizedProjectText[];
  media: ProjectMedia[];
};

type ProjectManifest = {
  version: 1;
  projects: Record<string, ManifestProject>;
};

const OWNER = "alf-2006";
const MANIFEST_URL = "https://raw.githubusercontent.com/alf-2006/my-portfolio-/main/content/project-showcases.json";
const MAX_README_BYTES = 1_500_000;
const MAX_JSON_BYTES = 350_000;
const MAX_MANIFEST_BYTES = 450_000;
const MAX_MEDIA = 12;
const MAX_HIGHLIGHTS = 8;
const MAX_LANGUAGES = 24;
const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

export class ProjectDetailsUpstreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectDetailsUpstreamError";
  }
}

function stringValue(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const valueWithoutControls = value.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
  return valueWithoutControls ? valueWithoutControls.slice(0, maxLength) : null;
}

function localizedText(value: unknown, maxLength = 240): LocalizedProjectText | null {
  const direct = stringValue(value, maxLength);
  if (direct) return direct;
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as UnknownRecord;
  const en = stringValue(record.en, maxLength);
  const ar = stringValue(record.ar, maxLength);
  return en || ar ? { ...(en ? { en } : {}), ...(ar ? { ar } : {}) } : null;
}

function safeUrl(value: unknown): string | null {
  const raw = stringValue(value, 4_096);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if ((url.protocol !== "https:" && url.protocol !== "http:") || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function youtubeId(value: unknown): string | null {
  const raw = safeUrl(value);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    let id = "";
    if (host === "youtu.be") {
      id = url.pathname.slice(1).split("/")[0] || "";
    } else if (host === "youtube.com" || host === "www.youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com" || host === "www.youtube-nocookie.com") {
      if (url.pathname === "/watch") id = url.searchParams.get("v") || "";
      else if (/^\/(?:embed|shorts|live)\//.test(url.pathname)) id = url.pathname.split("/")[2] || "";
    }
    return /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

function youtubeEmbed(value: unknown): string | null {
  const id = youtubeId(value);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

function normalizeMedia(value: unknown): ProjectMedia | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as UnknownRecord;
  const type = item.type === "image" || item.type === "video" || item.type === "youtube" ? item.type : null;
  if (!type) return null;
  const src = type === "youtube" ? youtubeEmbed(item.src) : safeUrl(item.src);
  if (!src) return null;
  const alt = localizedText(item.alt, 280) || "Project media";
  const caption = localizedText(item.caption, 280) || undefined;
  const poster = type === "youtube" || type === "video" ? safeUrl(item.poster) || undefined : undefined;
  const captions = Array.isArray(item.captions)
    ? item.captions.slice(0, 4).flatMap((captionValue) => {
        if (!captionValue || typeof captionValue !== "object" || Array.isArray(captionValue)) return [];
        const captionItem = captionValue as UnknownRecord;
        const captionSrc = safeUrl(captionItem.src);
        const language = stringValue(captionItem.language, 16);
        const label = stringValue(captionItem.label, 80);
        return captionSrc && language && label ? [{ src: captionSrc, language, label }] : [];
      })
    : undefined;
  return { type, src, alt, ...(caption ? { caption } : {}), ...(poster ? { poster } : {}), ...(captions?.length ? { captions } : {}) };
}

export function normalizeManifest(value: unknown): ProjectManifest {
  const root = value && typeof value === "object" && !Array.isArray(value) ? (value as UnknownRecord) : {};
  if (root.version !== 1) return { version: 1, projects: {} };
  const projectsValue = root.projects && typeof root.projects === "object" && !Array.isArray(root.projects) ? root.projects as UnknownRecord : {};
  const projects: Record<string, ManifestProject> = {};
  for (const [repository, projectValue] of Object.entries(projectsValue).slice(0, 200)) {
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9._-]{0,98}[A-Za-z0-9])?$/.test(repository)) continue;
    if (!projectValue || typeof projectValue !== "object" || Array.isArray(projectValue)) continue;
    const project = projectValue as UnknownRecord;
    const media = Array.isArray(project.media)
      ? project.media.slice(0, MAX_MEDIA).flatMap((mediaValue) => {
          const normalized = normalizeMedia(mediaValue);
          return normalized ? [normalized] : [];
        })
      : [];
    const highlights = Array.isArray(project.highlights)
      ? project.highlights.slice(0, MAX_HIGHLIGHTS).flatMap((item) => {
          const text = localizedText(item, 240);
          return text ? [text] : [];
        })
      : [];
    projects[repository] = { title: localizedText(project.title), summary: localizedText(project.summary, 600), highlights, media };
  }
  return { version: 1, projects };
}

async function readBody(response: Response, maxBytes: number): Promise<string> {
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) throw new ProjectDetailsUpstreamError("GitHub response is too large");
  if (!response.body) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > maxBytes) throw new ProjectDetailsUpstreamError("GitHub response is too large");
    return new TextDecoder().decode(bytes);
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      total += result.value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new ProjectDetailsUpstreamError("GitHub response is too large");
      }
      chunks.push(result.value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

async function githubFetch(url: string, maxBytes: number): Promise<Response> {
  try {
    const response = await fetch(url, { headers: GITHUB_HEADERS, signal: AbortSignal.timeout(8_000), cache: "no-store" });
    if (!response.ok) {
      throw new ProjectDetailsUpstreamError(`GitHub returned ${response.status}`);
    }
    // Reading the body here is intentionally left to the caller; this check rejects oversized fixed-length responses early.
    const contentLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > maxBytes) throw new ProjectDetailsUpstreamError("GitHub response is too large");
    return response;
  } catch (error) {
    if (error instanceof ProjectDetailsUpstreamError) throw error;
    throw new ProjectDetailsUpstreamError("Could not reach GitHub");
  }
}

async function fetchJson(url: string, maxBytes: number): Promise<unknown> {
  const response = await githubFetch(url, maxBytes);
  const body = await readBody(response, maxBytes);
  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new ProjectDetailsUpstreamError("GitHub returned invalid JSON");
  }
}

async function loadManifest(): Promise<ProjectManifest> {
  "use cache";
  cacheLife("hours");
  try {
    const response = await fetch(MANIFEST_URL, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8_000), cache: "no-store" });
    if (response.ok) return normalizeManifest(JSON.parse(await readBody(response, MAX_MANIFEST_BYTES)) as unknown);
  } catch {
    // A local tracked manifest keeps a new deploy useful while the public repository file is unavailable.
  }
  return normalizeManifest(showcaseManifest as unknown);
}

async function fetchReadme(repository: string): Promise<ReadmePayload | null> {
  const url = `https://api.github.com/repos/${OWNER}/${encodeURIComponent(repository)}/readme`;
  try {
    return await fetchJson(url, MAX_README_BYTES) as ReadmePayload;
  } catch (error) {
    if (error instanceof ProjectDetailsUpstreamError && error.message === "GitHub returned 404") return null;
    throw error;
  }
}

async function fetchLanguages(repository: string): Promise<string[]> {
  try {
    const payload = await fetchJson(`https://api.github.com/repos/${OWNER}/${encodeURIComponent(repository)}/languages`, MAX_JSON_BYTES);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
    return Object.keys(payload as UnknownRecord).map((language) => stringValue(language, 40)).filter((language): language is string => Boolean(language)).slice(0, MAX_LANGUAGES);
  } catch {
    return [];
  }
}

function decodeReadme(payload: ReadmePayload): string | null {
  if (payload.encoding !== "base64" || typeof payload.content !== "string") return null;
  const encoded = payload.content.replace(/\s/g, "");
  if (encoded.length > Math.ceil(MAX_README_BYTES / 3) * 4) return null;
  try {
    const decoded = Buffer.from(encoded, "base64");
    if (decoded.byteLength > MAX_README_BYTES) return null;
    return new TextDecoder().decode(decoded);
  } catch {
    return null;
  }
}

function plainText(node: AstNode): string {
  if (node.type === "code" || node.type === "inlineCode" || node.type === "html") return "";
  if (node.type === "image") return node.alt || "";
  if (node.type === "text" || node.type === "break") return node.value || " ";
  return (node.children || []).map(plainText).join(" ");
}

function cleanText(value: string, maxLength: number): string | null {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (!cleaned || /(?:api[_ -]?key|password|client[_ -]?secret|access[_ -]?token|authorization)\s*[:=]/i.test(cleaned)) return null;
  return cleaned.slice(0, maxLength);
}

function isTemplateScaffolding(value: string): boolean {
  return /welcome\s+to\s+your\s+lovable\s+project|replace_with_project_id|how\s+can\s+i\s+edit\s+this\s+code|use\s+your\s+preferred\s+ide|clone\s+this\s+repo|install\s+dependencies|npm\s+(?:install|run\s+dev)|yarn\s+(?:install|dev)|pnpm\s+(?:install|dev)/i.test(value);
}

function headingText(node: AstNode): string {
  return cleanText(plainText(node), 160)?.toLowerCase() || "";
}

function isFeatureHeading(value: string): boolean {
  return /^(?:key\s+)?features?$|^highlights?$|^capabilities$|^what(?:\s+it)?\s+does$|^core\s+features?$|^functionality$/.test(value.replace(/[#:]/g, "").trim());
}

function extractSummary(tree: AstNode): string | null {
  const children = tree.children || [];
  const firstHeading = children.findIndex((node) => node.type === "heading");
  const start = firstHeading >= 0 && children[firstHeading].depth === 1 ? firstHeading + 1 : 0;
  for (let index = start; index < children.length; index += 1) {
    const node = children[index];
    if (node.type === "heading" && index !== start) break;
    if (node.type !== "paragraph") continue;
    const paragraphChildren = node.children || [];
    if (paragraphChildren.length > 0 && paragraphChildren.every((child) => child.type === "image" || (child.type === "link" && (child.children || []).every((grandchild) => grandchild.type === "image")))) continue;
    const summary = cleanText(plainText(node), 600);
    if (summary && !isTemplateScaffolding(summary) && !/^https?:\/\//i.test(summary) && !/^\[?\s*!?\[/.test(summary)) return summary;
  }
  return null;
}

function extractTitle(tree: AstNode): string | null {
  const heading = (tree.children || []).find((node) => node.type === "heading" && node.depth === 1);
  return heading ? cleanText(plainText(heading), 180) : null;
}

function extractHighlights(tree: AstNode): string[] {
  const children = tree.children || [];
  const results: string[] = [];
  for (let index = 0; index < children.length; index += 1) {
    const heading = children[index];
    if (heading.type !== "heading" || !isFeatureHeading(headingText(heading))) continue;
    const level = heading.depth || 2;
    for (let cursor = index + 1; cursor < children.length; cursor += 1) {
      const block = children[cursor];
      if (block.type === "heading" && (block.depth || 2) <= level) break;
      if (block.type !== "list") continue;
      for (const item of block.children || []) {
        const text = cleanText(plainText(item), 240);
        if (text && !isTemplateScaffolding(text) && !results.includes(text)) results.push(text);
        if (results.length >= MAX_HIGHLIGHTS) return results;
      }
    }
  }
  return results;
}

function isLikelyBadge(url: string, alt: string): boolean {
  const lower = `${url} ${alt}`.toLowerCase();
  return /shields\.io|badgen\.net|badge|\/badges?\//.test(lower) || /(?:^|[\/_-])(?:logo|logos|favicon|icon|icons|avatar)(?:[._\/-]|$)/.test(lower) || /node_modules/.test(lower);
}

function readmeRoots(repository: string, payload: ReadmePayload): { directory: URL; root: URL } {
  const path = stringValue(payload.path, 500) || "README.md";
  const download = safeUrl(payload.download_url);
  if (download) {
    const downloadUrl = new URL(download);
    const pathSegments = path.replace(/^\/+/, "").split("/").filter(Boolean).length || 1;
    const allSegments = downloadUrl.pathname.split("/").filter(Boolean);
    const rootSegments = allSegments.slice(0, Math.max(0, allSegments.length - pathSegments));
    const root = new URL(`${downloadUrl.origin}/${rootSegments.join("/")}/`);
    return { directory: new URL("./", downloadUrl), root };
  }
  const branch = "main";
  const root = new URL(`https://raw.githubusercontent.com/${OWNER}/${encodeURIComponent(repository)}/${branch}/`);
  return { directory: new URL(path.split("/").slice(0, -1).join("/") + (path.includes("/") ? "/" : ""), root), root };
}

function resolveReadmeAsset(value: string, roots: { directory: URL; root: URL }): string | null {
  const raw = value.trim();
  if (!raw || raw.startsWith("#") || /^(?:data|javascript|mailto|tel):/i.test(raw)) return null;
  try {
    const resolved = raw.startsWith("/") ? new URL(raw.slice(1), roots.root) : new URL(raw, roots.directory);
    return safeUrl(resolved.toString());
  } catch {
    return null;
  }
}

function htmlAttribute(tag: string, name: string): string | null {
  const match = new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i").exec(tag);
  return match?.[1] || null;
}

function extractMedia(markdown: string, tree: AstNode, repository: string, payload: ReadmePayload): ProjectMedia[] {
  const roots = readmeRoots(repository, payload);
  const media: ProjectMedia[] = [];
  const seen = new Set<string>();
  const definitions = new Map<string, string>();
  visit(tree, (node: AstNode) => {
    if (node.type === "definition" && node.identifier && node.url) definitions.set(node.identifier.toLowerCase(), node.url);
  });
  const add = (item: ProjectMedia | null) => {
    if (!item || media.length >= MAX_MEDIA || seen.has(`${item.type}:${item.src}`)) return;
    seen.add(`${item.type}:${item.src}`);
    media.push(item);
  };
  visit(tree, (node: AstNode) => {
    const nodeUrl = node.url || (node.identifier ? definitions.get(node.identifier.toLowerCase()) : undefined);
    if ((node.type === "image" || node.type === "imageReference") && nodeUrl) {
      const source = resolveReadmeAsset(nodeUrl, roots);
      const alt = cleanText(node.alt || "Project screenshot", 280);
      if (source && alt && !isLikelyBadge(source, alt)) add({ type: "image", src: source, alt });
    } else if ((node.type === "link" || node.type === "linkReference") && nodeUrl) {
      const videoId = youtubeId(nodeUrl);
      const linkText = cleanText(plainText(node), 280) || "Project video";
      if (videoId) add({ type: "youtube", src: `https://www.youtube-nocookie.com/embed/${videoId}`, alt: linkText });
      else if (/\.(?:mp4|webm|ogg|mov)(?:[?#].*)?$/i.test(nodeUrl)) {
        const source = resolveReadmeAsset(nodeUrl, roots);
        if (source) add({ type: "video", src: source, alt: linkText });
      }
    } else if ((node.type === "html" && node.value) || (node.type === "paragraph" && node.children?.some((child) => child.type === "html" && /<video\b/i.test(child.value || "")))) {
      const html = node.type === "html" ? node.value || "" : (node.children || []).filter((child) => child.type === "html").map((child) => child.value || "").join("");
      for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
        const imageTag = match[0];
        const source = resolveReadmeAsset(htmlAttribute(imageTag, "src") || "", roots);
        const alt = cleanText(htmlAttribute(imageTag, "alt") || "Project screenshot", 280);
        if (source && alt && !isLikelyBadge(source, alt)) add({ type: "image", src: source, alt });
      }
      const videoTag = /<video\b[^>]*>/i.exec(html)?.[0];
      if (videoTag) {
        const nestedSource = /<source\b[^>]*>/i.exec(html)?.[0];
        const source = resolveReadmeAsset(htmlAttribute(videoTag, "src") || (nestedSource ? htmlAttribute(nestedSource, "src") : null) || "", roots);
        const poster = resolveReadmeAsset(htmlAttribute(videoTag, "poster") || "", roots) || undefined;
        const alt = cleanText(htmlAttribute(videoTag, "aria-label") || "Project video", 280);
        if (source && alt) add({ type: "video", src: source, alt, ...(poster ? { poster } : {}) });
      }
    }
  });
  // Keep this argument explicit: media is extracted from the parsed README, never by fetching arbitrary URLs.
  void markdown;
  return media;
}

function metadataText(repository: GitHubRepository): string | null {
  return cleanText(repository.description || "", 600);
}

function readmeUrl(payload: ReadmePayload, repository: string): string | null {
  return safeUrl(payload.html_url) || `https://github.com/${OWNER}/${encodeURIComponent(repository)}/blob/main/README.md`;
}

export async function parseReadme(repository: string, payload: ReadmePayload | null, repositoryRecord: GitHubRepository, manifestMedia: ProjectMedia[], manifestTitle: LocalizedProjectText | null, manifestSummary: LocalizedProjectText | null = null, manifestHighlights: LocalizedProjectText[] = []): Promise<ProjectDetails> {
  const readme = payload ? decodeReadme(payload) : null;
  const tree = readme ? unified().use(remarkParse).parse(readme) as unknown as AstNode : null;
  const readmeMedia = tree && payload && readme ? extractMedia(readme, tree, repository, payload) : [];
  const summary = manifestSummary || (tree ? extractSummary(tree) : null) || metadataText(repositoryRecord);
  const title = manifestTitle || (tree ? extractTitle(tree) : null) || repository;
  const media = manifestMedia.length ? manifestMedia : readmeMedia;
  const source = manifestTitle || manifestSummary || manifestHighlights.length || manifestMedia.length ? "manifest" : readme || readmeMedia.length || summary ? "readme" : "repository";
  return {
    repository,
    title,
    summary,
    highlights: manifestHighlights.length ? manifestHighlights : tree ? extractHighlights(tree) : [],
    media,
    readme,
    readmeUrl: payload && readme ? readmeUrl(payload, repository) : null,
    languages: [],
    source,
  };
}

/** Cached per repository; thrown upstream errors are deliberately not converted to successful empty details. */
export async function getProjectDetails(repository: string, repositoryRecord: GitHubRepository): Promise<ProjectDetails> {
  "use cache";
  cacheLife("hours");
  const manifest = await loadManifest();
  const curated = manifest.projects[repository];
  const [readme, languages] = await Promise.all([fetchReadme(repository), fetchLanguages(repository)]);
  const details = await parseReadme(repository, readme, repositoryRecord, curated?.media || [], curated?.title || null, curated?.summary || null, curated?.highlights || []);
  details.languages = languages.length ? languages : repositoryRecord.language ? [repositoryRecord.language] : [];
  return details;
}

export async function getPublicRepository(repository: string): Promise<GitHubRepository | null> {
  const repositories = await getGitHubRepositories();
  return repositories.find((candidate) => candidate.name === repository) || null;
}

export function validRepositoryName(repository: string): boolean {
  return /^[A-Za-z0-9](?:[A-Za-z0-9._-]{0,98}[A-Za-z0-9])?$/.test(repository);
}

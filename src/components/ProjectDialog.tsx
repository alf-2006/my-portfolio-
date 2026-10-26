"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, FileText, ImageIcon, LoaderCircle, Play, X } from "lucide-react";
import type { Dictionary } from "@/content/site";
import type { GitHubRepository } from "@/content/github";
import { projectText, type ProjectDetails, type ProjectMedia } from "@/content/project-types";
import { GithubIcon } from "./Icons";
import "./project-showcase.css";

const ProjectReadme = dynamic(() => import("./ProjectReadme"));
const detailsCache = new Map<string, { data: ProjectDetails; expires: number }>();
function cachedDetails(name: string): ProjectDetails | null {
  const entry = detailsCache.get(name);
  return entry && entry.expires > Date.now() ? entry.data : null;
}

type Labels = Dictionary["work"];
type Props = { repository: GitHubRepository; locale: "en" | "ar"; labels: Labels; opensNew: string; onDismiss: () => void };

function External({ href, children, className, opensNew }: { href: string; children: React.ReactNode; className?: string; opensNew: string }) {
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only"> {opensNew}</span></a>;
}

function MediaViewer({ media, locale, labels, opensNew }: { media: ProjectMedia; locale: "en" | "ar"; labels: Labels; opensNew: string }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const alt = projectText(media.alt, locale) || labels.image;
  const original = media.type === "youtube" ? media.src.replace("https://www.youtube-nocookie.com/embed/", "https://www.youtube.com/watch?v=") : media.src;
  return (
    <>
      <div className="project-showcase__viewer">
        {failed ? (
          <div className="project-showcase__mediaFailure" role="status"><ImageIcon size={32} aria-hidden="true" /><p>{labels.mediaError}</p></div>
        ) : media.type === "image" ? (
          // GitHub-managed original media is displayed without proxying arbitrary remote URLs through the server.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.src} alt={alt} className="project-showcase__mainImage" onError={() => setFailed(true)} decoding="async" referrerPolicy="no-referrer" />
        ) : !playing ? (
          <button type="button" className="project-showcase__play" onClick={() => setPlaying(true)} aria-label={`${labels.playVideo}: ${alt}`}>
            {media.poster && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.poster} alt="" className="project-showcase__poster" />
            )}
            <span className="project-showcase__playIcon"><Play size={28} aria-hidden="true" /></span>
            <span>{labels.playVideo}</span>
          </button>
        ) : media.type === "youtube" ? (
          <iframe src={media.src} title={alt} allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="project-showcase__video" />
        ) : (
          <video src={media.src} controls playsInline preload="metadata" poster={media.poster} className="project-showcase__video" aria-label={alt} onError={() => setFailed(true)}>
            {media.captions?.map((track) => <track key={track.src} kind="captions" src={track.src} srcLang={track.language} label={track.label} />)}
            <a href={original}>{labels.openMedia}</a>
          </video>
        )}
      </div>
      <div className="project-showcase__caption">
        <p>{projectText(media.caption, locale) || alt}</p>
        <External href={original} className="project-showcase__original" opensNew={opensNew}>{labels.openMedia}<ArrowUpRight size={14} aria-hidden="true" /></External>
      </div>
    </>
  );
}

function Gallery({ media, locale, labels, opensNew }: { media: ProjectMedia[]; locale: "en" | "ar"; labels: Labels; opensNew: string }) {
  const [index, setIndex] = useState(0);
  const selected = media[index];
  const position = labels.mediaPosition.replace("{current}", String(index + 1)).replace("{total}", String(media.length));
  return (
    <section className="project-showcase__gallery" aria-label={labels.gallery}>
      <div className="project-showcase__galleryHead">
        <span>{selected.type === "image" ? labels.image : labels.video}</span>
        <span aria-live="polite" aria-atomic="true">{position}</span>
      </div>
      <MediaViewer key={`${selected.src}-${index}`} media={selected} locale={locale} labels={labels} opensNew={opensNew} />
      {media.length > 1 && (
        <div className="project-showcase__galleryControls">
          <button type="button" className="project-showcase__iconButton" disabled={index === 0} onClick={() => setIndex((value) => value - 1)} aria-label={labels.previousMedia}><ChevronLeft size={20} aria-hidden="true" /></button>
          <div className="project-showcase__thumbnails">
            {media.map((item, i) => (
              <button key={`${item.src}-${i}`} type="button" className="project-showcase__thumbnail" aria-pressed={i === index} aria-label={`${item.type === "image" ? labels.image : labels.video} ${i + 1}: ${projectText(item.caption || item.alt, locale)}`} onClick={() => setIndex(i)}>
                {item.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.src} alt="" loading="lazy" referrerPolicy="no-referrer" />
                ) : <Play size={20} aria-hidden="true" />}
                <span className="project-showcase__thumbnailNumber">{String(i + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
          <button type="button" className="project-showcase__iconButton" disabled={index === media.length - 1} onClick={() => setIndex((value) => value + 1)} aria-label={labels.nextMedia}><ChevronRight size={20} aria-hidden="true" /></button>
        </div>
      )}
    </section>
  );
}

export default function ProjectDialog({ repository, locale, labels, opensNew, onDismiss }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dismissRef = useRef(onDismiss);
  const id = useId();
  const [details, setDetails] = useState<ProjectDetails | null>(() => cachedDetails(repository.name));
  const [status, setStatus] = useState<"loading" | "ready" | "error">(() => cachedDetails(repository.name) ? "ready" : "loading");
  const [attempt, setAttempt] = useState(0);
  const [showReadme, setShowReadme] = useState(false);
  useEffect(() => { dismissRef.current = onDismiss; }, [onDismiss]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = document.documentElement;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const lenis = window.__lenis as { stop?: () => void; start?: () => void; isStopped?: boolean } | undefined;
    const wasScrolling = Boolean(lenis && !lenis.isStopped);
    if (wasScrolling) lenis?.stop?.();
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
      if (wasScrolling) lenis?.start?.();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (attempt === 0 && cachedDetails(repository.name)) return;
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 25000);
    fetch(`/api/projects/${encodeURIComponent(repository.name)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Project details returned ${response.status}`);
        const data: ProjectDetails = await response.json();
        if (data.repository !== repository.name || !Array.isArray(data.media)) throw new Error("Unexpected project details");
        return data;
      })
      .then((data) => {
        if (!active) return;
        detailsCache.set(repository.name, { data, expires: Date.now() + 3600000 });
        setDetails(data);
        setStatus("ready");
      })
      .catch(() => { if (active) setStatus("error"); })
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, [repository.name, attempt]);

  function closeFromBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dismissRef.current();
  }
  const title = projectText(details?.title, locale) || repository.name;
  const summary = projectText(details?.summary, locale) || repository.description;
  const hasMedia = Boolean(details?.media.length);
  return (
    <dialog ref={dialogRef} className="project-showcase__dialog" dir={locale === "ar" ? "rtl" : "ltr"} aria-labelledby={`${id}-title`} onCancel={(event) => { event.preventDefault(); dismissRef.current(); }} onClick={closeFromBackdrop} data-lenis-prevent>
      <header className="project-showcase__header">
        <div className="project-showcase__headerIdentity"><GithubIcon size={20} /><span>{labels.projectPreview}</span></div>
        <button type="button" className="project-showcase__iconButton" onClick={() => dismissRef.current()} aria-label={labels.closeProject} autoFocus><X size={21} aria-hidden="true" /></button>
      </header>
      <div className="project-showcase__scroll" data-lenis-prevent>
        <div className="project-showcase__titleRow">
          <div><p className="project-showcase__eyebrow" dir="ltr">alf-2006 / {repository.name}</p><h2 id={`${id}-title`} className="project-showcase__title" dir="auto">{title}</h2></div>
          {repository.archived && <span className="repo-card__archived">{labels.archived}</span>}
        </div>
        {status === "loading" && <div className="project-showcase__loading" role="status"><LoaderCircle size={20} aria-hidden="true" /><p>{labels.loadingProject}</p></div>}
        {status === "error" && <div className="project-showcase__error" role="alert"><p>{labels.projectError}</p><button type="button" onClick={() => { setStatus("loading"); setAttempt((value) => value + 1); }}>{labels.retry}</button></div>}
        <div className={`${"project-showcase__body"} ${hasMedia ? "" : "project-showcase__bodyNoMedia"}`}>
          {status === "ready" && details && (
            hasMedia ? <Gallery media={details.media} locale={locale} labels={labels} opensNew={opensNew} /> : (
              <div className="project-showcase__empty">
                <FileText size={34} aria-hidden="true" /><h3>{labels.noMedia}</h3><p>{labels.noMediaNote}</p>
                <span className="project-showcase__sourceNote"><GithubIcon size={14} /> {labels.dataSource}</span>
              </div>
            )
          )}
          <aside className="project-showcase__info">
            {summary && <section><h3 className="project-showcase__sectionLabel">{labels.overview}</h3><p className="project-showcase__summary" dir="auto">{summary}</p></section>}
            {details && details.highlights.length > 0 && <section><h3 className="project-showcase__sectionLabel">{labels.highlights}</h3><ul className="project-showcase__highlights">{details.highlights.map((item, i) => <li key={i}><Check size={15} aria-hidden="true" /><span dir="auto">{projectText(item, locale)}</span></li>)}</ul></section>}
            <section><h3 className="project-showcase__sectionLabel">{labels.topics}</h3><ul className="project-showcase__chips">{(details?.languages.length ? details.languages : [repository.language || labels.noLanguage]).map((language) => <li key={language}>{language}</li>)}{repository.topics.map((topic) => <li key={`topic-${topic}`}>{topic}</li>)}</ul></section>
            <div className="project-showcase__actions">
              {repository.homepage && <External href={repository.homepage} className="btn btn-sm" opensNew={opensNew}>{labels.website}<ArrowUpRight size={17} aria-hidden="true" /></External>}
              <External href={repository.url} className="btn btn-sm btn-ghost" opensNew={opensNew}><GithubIcon size={16} /> GitHub<ArrowUpRight size={16} aria-hidden="true" /></External>
            </div>
          </aside>
        </div>
        {details?.readme && (
          <section className="project-showcase__documentation">
            <button type="button" className="project-showcase__documentationToggle" onClick={() => setShowReadme((value) => !value)} aria-expanded={showReadme} aria-controls={`${id}-readme`}><span><FileText size={18} aria-hidden="true" />{labels.readme}</span><span aria-hidden="true">{showReadme ? "−" : "+"}</span></button>
            <div id={`${id}-readme`} hidden={!showReadme}>{showReadme && <ProjectReadme markdown={details.readme} sourceUrl={details.readmeUrl || repository.url} opensNew={opensNew} />}</div>
          </section>
        )}
        <footer className="project-showcase__footer"><span><GithubIcon size={14} />{labels.dataSource}</span>{details?.readmeUrl && <External href={details.readmeUrl} opensNew={opensNew}>{labels.readmeLink}<ArrowUpRight size={14} aria-hidden="true" /></External>}</footer>
      </div>
    </dialog>
  );
}

"use client";

import { useState } from "react";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import type { Dictionary } from "@/content/site";
import type { GitHubRepository } from "@/content/github";
import { GithubIcon } from "./Icons";
import ProjectDialog from "./ProjectDialog";

type Props = { repositories: GitHubRepository[]; locale: "en" | "ar"; labels: Dictionary["work"]; opensNew: string };

function RepositoryCard({ repository, locale, labels, opensNew, onOpen }: Omit<Props, "repositories"> & {
  repository: GitHubRepository;
  onOpen: (repository: GitHubRepository) => void;
}) {
  const date = new Date(repository.updatedAt);
  const updated = Number.isNaN(date.getTime()) ? labels.unknownDate : new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
  return (
    <article className="repo-card repo-card--interactive">
      <div className="repo-card__head">
        <h3 className="repo-card__name">
          <button type="button" onClick={() => onOpen(repository)} aria-haspopup="dialog">{repository.name}</button>
        </h3>
        {repository.archived && <span className="repo-card__archived">{labels.archived}</span>}
      </div>
      <p className={`repo-card__description${repository.description ? "" : " repo-card__description--empty"}`}>{repository.description || labels.noDescription}</p>
      {repository.topics.length > 0 && (
        <ul className="repo-card__topics" aria-label={labels.topics}>
          {repository.topics.slice(0, 4).map((topic) => <li key={topic}>{topic}</li>)}
          {repository.topics.length > 4 && <li className="repo-card__topic-more">+{repository.topics.length - 4}</li>}
        </ul>
      )}
      <div className="repo-card__meta">
        <span className="repo-card__language">{repository.language || labels.noLanguage}</span>
        <span aria-label={`${labels.stars}: ${repository.stars}`} title={`${labels.stars}: ${repository.stars}`}><Star size={14} aria-hidden="true" /> {repository.stars}</span>
        <span aria-label={`${labels.forks}: ${repository.forks}`} title={`${labels.forks}: ${repository.forks}`}><GitFork size={14} aria-hidden="true" /> {repository.forks}</span>
        <time dateTime={repository.updatedAt} title={`${labels.updated}: ${updated}`}>{updated}</time>
      </div>
      <div className="repo-card__links repo-card__links--showcase">
        <button className="repo-card__explore" type="button" onClick={() => onOpen(repository)} aria-haspopup="dialog">
          {labels.viewProject}<ArrowUpRight size={16} aria-hidden="true" />
        </button>
        <a href={repository.url} className="repo-card__source" target="_blank" rel="noopener noreferrer" aria-label={`${repository.name} — ${labels.source} ${opensNew}`}>
          <GithubIcon size={18} /><span>GitHub</span>
        </a>
      </div>
    </article>
  );
}

export default function Projects({ repositories, locale, labels, opensNew }: Props) {
  const [selected, setSelected] = useState<GitHubRepository | null>(null);
  const open = (repository: GitHubRepository) => setSelected(repository);
  return (
    <>
      <div className="repo-grid">
        {repositories.slice(0, 6).map((repository) => <RepositoryCard key={repository.id} repository={repository} locale={locale} labels={labels} opensNew={opensNew} onOpen={open} />)}
      </div>
      {repositories.length > 6 && (
        <details className="repo-more">
          <summary>{labels.showAll.replace("{count}", String(repositories.length))}</summary>
          <div className="repo-grid">
            {repositories.slice(6).map((repository) => <RepositoryCard key={repository.id} repository={repository} locale={locale} labels={labels} opensNew={opensNew} onOpen={open} />)}
          </div>
        </details>
      )}
      {selected && <ProjectDialog key={selected.id} repository={selected} locale={locale} labels={labels} opensNew={opensNew} onDismiss={() => setSelected(null)} />}
    </>
  );
}

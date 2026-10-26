import { cacheLife } from "next/cache";

const API_URL = "https://api.github.com/users/alf-2006/repos?type=owner&per_page=100&sort=updated";

export type GitHubRepository = {
  id: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  archived: boolean;
};

type GitHubApiRepository = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
};

function safeHomepage(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/** GitHub is the source of truth; the cached public feed refreshes hourly. */
export async function getGitHubRepositories(): Promise<GitHubRepository[]> {
  "use cache";
  cacheLife("hours");

  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      console.error(`GitHub repository feed returned ${response.status}`);
      return [];
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      console.error("GitHub repository feed returned an unexpected payload");
      return [];
    }

    return (payload as GitHubApiRepository[])
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        homepage: safeHomepage(repo.homepage),
        language: repo.language,
        topics: Array.isArray(repo.topics) ? repo.topics : [],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
        archived: repo.archived,
      }))
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  } catch (error) {
    console.error("Could not load GitHub repository data", error);
    return [];
  }
}

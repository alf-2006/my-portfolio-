import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import test from "node:test";
import {
  normalizeManifest,
  parseReadme,
  validRepositoryName,
  youtubeId,
} from "../src/content/project-details";
import type { GitHubRepository } from "../src/content/github";

const repository: GitHubRepository = {
  id: 1,
  name: "demo-repo",
  description: "A repository description from GitHub.",
  url: "https://github.com/alf-2006/demo-repo",
  homepage: null,
  language: "TypeScript",
  topics: [],
  stars: 0,
  forks: 0,
  updatedAt: "2026-01-01T00:00:00.000Z",
  archived: false,
};

function readmePayload(markdown: string) {
  return {
    content: Buffer.from(markdown, "utf8").toString("base64"),
    encoding: "base64",
    path: "docs/README.md",
    html_url: "https://github.com/alf-2006/demo-repo/blob/main/docs/README.md",
    download_url: "https://raw.githubusercontent.com/alf-2006/demo-repo/main/docs/README.md",
  };
}

test("README AST parsing extracts introduction, feature bullets, and honest media", async () => {
  const details = await parseReadme(
    repository.name,
    readmePayload(
      [
        "# Demo Repo",
        "A small retail dashboard for managing stock and orders.",
        "",
        "![build badge](https://img.shields.io/badge/build-passing-green.svg)",
        "![Dashboard screenshot](../assets/dashboard.webp)",
        "",
        "## Features",
        "- Search and filter products",
        "- Arabic and English workflows",
        "",
        "## Setup",
        "- password: do-not-display",
        "",
        "[Watch the demo](https://www.youtube.com/watch?v=dQw4w9WgXcQ)",
      ].join("\n"),
    ),
    repository,
    [],
    null,
  );

  assert.equal(details.title, "Demo Repo");
  assert.equal(details.summary, "A small retail dashboard for managing stock and orders.");
  assert.deepEqual(details.highlights, ["Search and filter products", "Arabic and English workflows"]);
  assert.deepEqual(details.media, [
    {
      type: "image",
      src: "https://raw.githubusercontent.com/alf-2006/demo-repo/main/assets/dashboard.webp",
      alt: "Dashboard screenshot",
    },
    {
      type: "youtube",
      src: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      alt: "Watch the demo",
    },
  ]);
  assert.equal(details.readmeUrl, "https://github.com/alf-2006/demo-repo/blob/main/docs/README.md");
});

test("root-relative README media is resolved to the repository root", async () => {
  const details = await parseReadme(
    repository.name,
    readmePayload("# Demo\n\n![Screen](/public/screen.png)"),
    repository,
    [],
    null,
  );
  assert.equal(details.media[0]?.src, "https://raw.githubusercontent.com/alf-2006/demo-repo/main/public/screen.png");
});

test("README template scaffolding does not become a project summary or highlight", async () => {
  const details = await parseReadme(
    repository.name,
    readmePayload(
      [
        "# Demo Repo",
        "Welcome to your Lovable project",
        "URL : https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID",
        "",
        "## Features",
        "- How can I edit this code?",
        "- npm install",
      ].join("\n"),
    ),
    repository,
    [],
    null,
  );
  assert.equal(details.summary, repository.description);
  assert.deepEqual(details.highlights, []);
});

test("manifest normalization rejects unsafe URLs and normalizes YouTube embeds", () => {
  const boundedImages = Array.from({ length: 20 }, (_, index) => ({
    type: "image",
    src: `https://example.com/${index}.png`,
    alt: `Image ${index}`,
  }));
  const manifest = normalizeManifest({
    version: 1,
    projects: {
      "demo-repo": {
        title: { en: "Demo" },
        media: [
          { type: "youtube", src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", alt: { en: "Demo" } },
          ...boundedImages,
          { type: "image", src: "https://user:pass@example.com/image.png", alt: "Should reject" },
          { type: "video", src: "javascript:alert(1)", alt: "Should reject" },
        ],
      },
    },
  });
  assert.equal(manifest.projects["demo-repo"]?.media.length, 12);
  assert.equal(manifest.projects["demo-repo"]?.media[0]?.src, "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
});

test("repository and YouTube syntax is restricted", () => {
  assert.equal(validRepositoryName("elahmed-retail-suite-main"), true);
  assert.equal(validRepositoryName("../private"), false);
  assert.equal(validRepositoryName("repo/other"), false);
  assert.equal(youtubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(youtubeId("https://example.com/embed/dQw4w9WgXcQ"), null);
});

test("GitHub showcase copy takes precedence without changing the README", async () => {
  const manifest = normalizeManifest({ version: 1, projects: { "demo-repo": {
    summary: { en: "Verified project overview", ar: "وصف المشروع" },
    highlights: [{ en: "Stock management", ar: "إدارة المخزون" }],
    media: [],
  } } });
  const curated = manifest.projects[repository.name];
  const details = await parseReadme(repository.name, readmePayload("# Demo\n\nREADME overview"), repository, curated.media, curated.title, curated.summary, curated.highlights);
  assert.deepEqual(details.summary, { en: "Verified project overview", ar: "وصف المشروع" });
  assert.deepEqual(details.highlights, [{ en: "Stock management", ar: "إدارة المخزون" }]);
  assert.equal(details.source, "manifest");
  assert.match(details.readme || "", /README overview/);
});

test("reference images and multiple HTML screenshots are discovered", async () => {
  const markdown = '# Demo\n\n![Dashboard][screen]\n\n[screen]: ../assets/dashboard.webp\n\n<div><img src="../assets/mobile.webp" alt="Mobile"><img src="/assets/report.webp" alt="Report"></div>\n\n<video aria-label="Demo video"><source src="../assets/demo.mp4"></video>';
  const details = await parseReadme(repository.name, readmePayload(markdown), repository, [], null);
  assert.deepEqual(details.media.map((item) => item.src), [
    "https://raw.githubusercontent.com/alf-2006/demo-repo/main/assets/dashboard.webp",
    "https://raw.githubusercontent.com/alf-2006/demo-repo/main/assets/mobile.webp",
    "https://raw.githubusercontent.com/alf-2006/demo-repo/main/assets/report.webp",
    "https://raw.githubusercontent.com/alf-2006/demo-repo/main/assets/demo.mp4",
  ]);
});

test("unsafe media URLs are rejected even before the item limit", () => {
  const manifest = normalizeManifest({ version: 1, projects: { "demo-repo": { media: [
    { type: "image", src: "javascript:alert(1)" },
    { type: "image", src: "https://user:pass@example.com/image.png" },
    { type: "youtube", src: "https://evil.example/embed/dQw4w9WgXcQ" },
    { type: "image", src: "data:image/png;base64,AAAA" },
  ] } } });
  assert.deepEqual(manifest.projects[repository.name].media, []);
});

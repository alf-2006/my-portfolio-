import Portfolio from "@/components/Portfolio";
import { en } from "@/content/site";
import { personJsonLd } from "@/content/meta";
import { getGitHubRepositories } from "@/content/github";

export default async function Page() {
  const repositories = await getGitHubRepositories();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(en)) }} />
      <Portfolio d={en} repositories={repositories} />
    </>
  );
}

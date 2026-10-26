import Portfolio from "@/components/Portfolio";
import { ar } from "@/content/site";
import { personJsonLd } from "@/content/meta";
import { getGitHubRepositories } from "@/content/github";

export default async function Page() {
  const repositories = await getGitHubRepositories();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(ar)) }} />
      <Portfolio d={ar} repositories={repositories} />
    </>
  );
}

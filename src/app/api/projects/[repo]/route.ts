import { getProjectDetails, getPublicRepository, ProjectDetailsUpstreamError, validRepositoryName } from "@/content/project-details";

export async function GET(_request: Request, context: { params: Promise<{ repo: string }> }) {
  const { repo } = await context.params;
  let repository: string;
  try {
    repository = decodeURIComponent(repo);
  } catch {
    return Response.json({ error: "Invalid repository" }, { status: 400 });
  }

  if (!validRepositoryName(repository)) {
    return Response.json({ error: "Invalid repository" }, { status: 400 });
  }

  const publicRepository = await getPublicRepository(repository);
  if (!publicRepository) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  try {
    const details = await getProjectDetails(repository, publicRepository);
    return Response.json(details, {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    if (!(error instanceof ProjectDetailsUpstreamError)) console.error("Could not load project details", error);
    return Response.json({ error: "Project details are temporarily unavailable" }, { status: 502 });
  }
}

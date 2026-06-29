import Projects from "@/shared/layouts/projects";
import { getProjects } from "@/shared/lib/services/projects.s";
import getMyToken from "@/shared/lib/utils/getToken";

/** Projects list page. Fetches all projects for the current user and renders the shared Projects layout. */
export default async function page() {
  // Token
  const token = await getMyToken();

  // Fetch Projects
  const { error: projectsError, data: projectsData } = await getProjects(
    `${token}`,
  );

  return (
    <div>
      <Projects
        data={projectsData?.data.projects ?? []}
        error={projectsError}
        env="page"
      />
    </div>
  );
}

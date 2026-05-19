import { Button } from "@/components/ui/button";
import Projects from "@/shared/layouts/projects";
import { getProjects } from "@/shared/lib/services/projects.s";
import getMyToken from "@/shared/lib/utils/getToken";

export default async function page() {
  // Token
  const token = await getMyToken();

  const { error: projectsError, data: projectsData } = await getProjects(
    `${token}`,
  );
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-500 ">Projects</h1>
        <Button className="w-fit">+ Add Project</Button>
      </div>
      <Projects
        data={projectsData?.data.projects ?? []}
        error={projectsError}
      />
    </div>
  );
}

import { ProjectType } from "@/shared/lib/types/app-data.t";
import { FolderOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AssignedProjects({
  projects,
}: {
  projects: ProjectType[];
}) {
  return (
    <div className="border border-gray-200 rounded-xl col-span-2  p-5 mt-4 max-lg:col-span-3 max-lg:h-fit">
      <div className="flex items-center  gap-4">
        <div className="bg-primary-50 w-fit p-2 rounded-full">
          <FolderOpen className="text-primary-400" size={20} />
        </div>
        <span className="font-semibold">Assigned Projects</span>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <div className="text-sm font-semibold w-full grid grid-cols-3 items-center bg-gray-100 p-2  rounded-t-2xl">
          <span>Name</span>
          <span className="text-center">Leads</span>
          <span className="text-center">Team Members</span>
        </div>
        {projects.length > 0 && (
          <ScrollArea className="h-14 max-sm:h-28">
            {projects.map((project, i) => {
              return (
                <div key={project._id}>
                  <div className="text-[12px] font-semibold w-full grid grid-cols-3 px-2 mb-1">
                    <span>{project.name}</span>
                    <span className="text-center">{project.leads.length}</span>
                    <span className="text-center">{project.team.length}</span>
                  </div>
                  {projects.length !== i + 1 && (
                    <Separator className="w-full" />
                  )}
                </div>
              );
            })}
          </ScrollArea>
        )}
      </div>
      {projects.length === 0 && (
        <div className=" text-center mt-2">No Projects.</div>
      )}
    </div>
  );
}

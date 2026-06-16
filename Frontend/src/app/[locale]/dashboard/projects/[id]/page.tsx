import { ErrorBox } from "@/shared/components/error_box";
import { getProject } from "@/shared/lib/services/projects.s";
import getMyToken from "@/shared/lib/utils/getToken";
import { formatDate } from "@/shared/lib/utils/formateDate";
import { DetailsProjectCard } from "./_components/details-Project-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadsTable from "../../_components/leads-table";
import UserTable from "@/app/[locale]/dashboard/_components/user-table";
import { Info, User, FileText } from "lucide-react";
import { User as TypeUser } from "@/shared/lib/types/app-data.t";
export default async function page({ params }: { params: { id: string } }) {
  const param = await params;
  // Token
  const token = await getMyToken();

  // Fetch Projects
  const { error: projectError, data: projectData } = await getProject(
    `${token}`,
    param.id,
  );

  // Statments
  if (projectError) {
    return <ErrorBox error={`${projectError}`} />;
  }

  // Variables
  const project = projectData.data.project;
  const projectCreator =
    project?.createdBy?.name.split(" ").length > 2
      ? project?.createdBy?.name.split(" ").slice(0, 2).join(" ")
      : project?.createdBy?.name || "-";

  const leaderNameArray = project?.leader?.name.split(" ");

  const leaderName =
    project?.leader?.name && leaderNameArray[0][0] + leaderNameArray[1][0];

  const teamIds = project.team.map((user: TypeUser) => user._id);
  return (
    <div>
      {/* Upper Card */}
      <DetailsProjectCard
        name={project.name}
        description={project.description}
        createdAt={formatDate(project.createdAt)}
        status="Active"
        totalLeads={project.leads.length}
        assignees={project.team.length}
        teamLeader={project?.leader?.name || "No Leader Yet"}
        id={project._id}
        teamIds={teamIds}
      />

      {/* Tabs */}
      <Tabs defaultValue="leads" className="mt-4 flex-1">
        <TabsList variant="line">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-4 gap-4">
          {/* Tabs Content */}
          <div className="col-span-3 max-md:col-span-4">
            <TabsContent value="leads">
              <LeadsTable leads={project.leads} env="project" />
            </TabsContent>
            <TabsContent value="team">
              <UserTable users={project.team} />
            </TabsContent>
            <div className=" wrap-break-word mt-4 col-span-1 rounded-md p-4 border">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="text-primary-200" />
                <h2 className="font-semibold">Project Description</h2>
              </div>
              <p className="w-2/3 max-md:  wrap-break-word">
                {project.description}
              </p>
            </div>
          </div>

          {/* Right side => Information */}
          <div className=" col-span-1 max-md:col-span-4">
            <div className=" wrap-break-word mt-4  rounded-md p-4 border">
              <div className="font-semibold flex gap-3 mb-5">
                <Info size={24} className="text-primary-500" />
                Project Information
              </div>
              <div className="font-semibold flex items-center justify-between gap-3 mb-4">
                <span>Created By</span>
                <span>{projectCreator}</span>
              </div>
              <div className="font-semibold flex items-center justify-between gap-3 mb-4">
                <span>Created At</span>
                <span>{formatDate(project.createdAt)}</span>
              </div>
              <div className="font-semibold flex items-center justify-between gap-3">
                <span>Updated At</span>
                <span>{formatDate(project.updatedAt)}</span>
              </div>
            </div>
            {project?.leader?.name && (
              <div className=" wrap-break-word mt-4  rounded-md p-4 border">
                <div className="font-semibold flex items-center gap-3 mb-5">
                  <span className="p-1 rounded-md bg-purple-300">
                    <User size={24} className="text-purple-400" />
                  </span>
                  Team Leader
                </div>
                <div className="font-semibold flex items-center gap-3 mb-5">
                  <span className="p-2 rounded-full bg-violet-400 text-violet-600">
                    {leaderName}
                  </span>
                  <div className="flex flex-col text-sm text-gray-400">
                    <span className="text-gray-600">{project.leader.name}</span>
                    <span>{project.leader.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}

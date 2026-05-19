import React from "react";
import ProjectCard from "../components/project-card";
import { ErrorBox } from "../components/error_box";
import type { ProjectType } from "../lib/types/app-data.t";
import { formatDate } from "../lib/utils/formateDate";

type ProjectsProps = {
  error?: string | null;
  data: ProjectType[];
};

export default function Projects({ data, error }: ProjectsProps) {
  return (
    <>
      {error && <ErrorBox error={`${error}`} />}
      <div className="grid grid-cols-2 max-lg:grid-cols-1 mt-4 gap-4">
        {data &&
          data.map((project: ProjectType) => {
            return (
              <ProjectCard
                key={project._id}
                id={project._id}
                name={project.name}
                createdAt={formatDate(project.createdAt)}
                allLeads={project.leads.length}
                assignees={project.team.length}
                leader={project.leader?.name || "Not Assigned yet"}
              />
            );
          })}
      </div>
    </>
  );
}

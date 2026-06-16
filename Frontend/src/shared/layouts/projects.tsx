"use client";

import React from "react";
import ProjectCard from "../components/project-card";
import { ErrorBox } from "../components/error_box";
import type { ProjectType } from "../lib/types/app-data.t";
import { formatDate } from "../lib/utils/formateDate";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import ProjectForm from "@/app/[locale]/dashboard/projects/_components/project-form";

type ProjectsProps = {
  error?: string | null;
  data: ProjectType[];
  env: "home" | "page";
};

export default function Projects({ data, error, env }: ProjectsProps) {
  // State
  const [search, setSearch] = React.useState("");

  const session = useSession();

  // Filter
  const filteredProjects = React.useMemo(() => {
    return data?.filter((project) => {
      const searchValue = search.toLowerCase();

      return project.name.toLowerCase().includes(searchValue);
    });
  }, [data, search]);

  return (
    <>
      <div className="flex items-center justify-between">
        {env === "page" && (
          <>
            <h1 className="text-3xl font-bold text-primary-500 ">Projects</h1>{" "}
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            {session.data?.user.role === "admin" && (
              <ProjectForm method="POST" />
            )}
          </>
        )}
      </div>
      {error && <ErrorBox error={`${error}`} />}
      <div className="grid grid-cols-2 max-lg:grid-cols-1 mt-4 gap-4">
        {data &&
          filteredProjects.map((project: ProjectType) => {
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
      {filteredProjects.length === 0 && (
        <div className="text-center mt-10 text-gray-400">No Results.</div>
      )}
    </>
  );
}

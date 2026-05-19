"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, FolderOpenDot, Trash2 } from "lucide-react";
import { AssignDialog } from "../assign-dialog";
import { useQuery } from "@tanstack/react-query";
import { getUsersAction } from "@/shared/lib/actions/user.action";
import { ErrorBox } from "../error_box";
import { Spinner } from "@/components/ui/spinner";
import { getProjectsAction } from "@/shared/lib/actions/projects.action";
import DeleteDialog from "../delete-dialog";

export default function DropDownActions({
  ids,
  bulk = false,
}: {
  ids: string[];
  bulk?: boolean;
}) {
  const {
    data: leads,
    error: leadsError,
    isPending: leadsIsPending,
  } = useQuery({
    queryKey: ["Users"],
    queryFn: async () => {
      const result = await getUsersAction();
      return result;
    },
  });

  const {
    data: projects,
    error: projectsError,
    isPending: projectsIsPending,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const result = await getProjectsAction();
      return result;
    },
  });

  let error = projectsError || leadsError;
  if (leadsError) {
    return <ErrorBox error={error?.message} />;
  }
  if (leadsIsPending || projectsIsPending) return <Spinner />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="h-6 w-6">
        <button className="flex size-6 items-center justify-center">
          <EllipsisVertical size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className=" w-48 py-1 rounded-xl">
        <DropdownMenuGroup>
          <div>
            <AssignDialog ids={ids} data={leads.data.users} target="user" />
          </div>
          <div>
            <AssignDialog
              ids={ids}
              data={projects.data.projects}
              target="project"
            />
          </div>
          {!bulk && (
            <div>
              <DeleteDialog id={ids[0]} />
            </div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

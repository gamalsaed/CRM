"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { EllipsisVertical } from "lucide-react";
import { AssignDialog } from "./assign-dialog";
import { useQuery } from "@tanstack/react-query";
import { getUsersAction } from "@/shared/lib/actions/user.action";
import { ErrorBox } from "./error_box";
import { Spinner } from "@/components/ui/spinner";
import { getProjectsAction } from "@/shared/lib/actions/projects.action";
import { deleteLead } from "@/shared/lib/actions/leads.action";
import DeleteDialog from "./delete-dialog";
import { restrictTo } from "@/shared/lib/utils/restrictTo";
import { useTranslations } from "next-intl";

export default function DropDownActions({
  ids,
  bulk = false,
}: {
  ids: string[];
  bulk?: boolean;
}) {
  const { data } = useSession();
  const t = useTranslations("LeadDropDown");

  const {
    data: users,
    error: usersError,
    isFetching: usersIsFetching,
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
    isFetching: projectsIsFetching,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const result = await getProjectsAction();
      return result;
    },
    enabled: data?.user?.role === "admin",
  });

  let error = projectsError || usersError;

  if (usersError) {
    return <ErrorBox error={error?.message} />;
  }
  if (usersIsFetching || projectsIsFetching) return <Spinner />;

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
            <AssignDialog ids={ids} data={users.data.query} target="user" />
          </div>
          {data && restrictTo(data?.user.role, "admin") && (
            <>
              <div>
                <AssignDialog
                  ids={ids}
                  data={projects.data.projects}
                  target="project"
                />
              </div>
              {!bulk && (
                <DeleteDialog
                  args={[ids[0]]}
                  deleteFn={deleteLead}
                  successMsg={t("deleteSuccessMsg")}
                  failMsg={t("deleteFailMsg")}
                  description={t("deleteDescription")}
                  title={t("deleteTitle")}
                />
              )}
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

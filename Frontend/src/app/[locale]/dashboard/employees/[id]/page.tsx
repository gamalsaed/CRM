import { getUserDetailsAction } from "@/shared/lib/actions/user.action";
import UserDetails from "./_components/user-details";
import AssignedProjects from "./_components/assigned-projects";
import Permissions from "./_components/permissions";
import UserTable from "@/app/[locale]/dashboard/_components/user-table";
import { Pencil, Trash2, UserCog, Users } from "lucide-react";
import { ProjectType, User } from "@/shared/lib/types/app-data.t";
import Link from "next/link";
import DeleteDialog from "@/shared/components/delete-dialog";
import { deleteUserAction } from "@/shared/lib/actions/user.action";

import { redirect } from "next/navigation";
// import { redirect } from "@/i18n/navigation";
export default async function page({ params }: { params: { id: string } }) {
  const param = await params;
  const userData = await getUserDetailsAction(param.id);

  if (userData === null) {
    redirect("/dashboard/employees");
  }

  const usersHeader = (
    <div className="flex items-center mb-3 gap-4">
      <div className="bg-primary-50 w-fit p-2 rounded-full">
        <Users className="text-primary-400" size={20} />
      </div>
      <span className="font-semibold">Team Members</span>
    </div>
  );

  let team = userData.data.projects.flatMap(
    (project: ProjectType) => project.team,
  );
  team = team.filter(
    (member: User) => member.email !== userData.data.user.email,
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold mb-5">User Details</h1>
        <div className="flex gap-3">
          <Link href={`${param.id}/edit`}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 text-xs font-medium hover:bg-blue-50 transition-colors">
              <Pencil size={13} />
              Edit
            </button>
          </Link>
          <DeleteDialog
            id={param.id}
            deleteFn={deleteUserAction}
            successMsg="You have deleted the user successfully"
            failMsg="Something went wrong!"
            title="Delete User"
            description="This action cannot be undone. The User will be permanently removed."
          >
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors">
              <Trash2 size={13} />
              Delete
            </button>
          </DeleteDialog>
        </div>
      </div>
      <UserDetails
        user={userData.data.user}
        projects={userData.data.projects}
        leads={userData.data.leads}
      />
      <div className="grid grid-cols-3 h-fit grid-rows-1 max-md:grid-cols-1 gap-4">
        <Permissions role={userData.data.user.role} />
        <AssignedProjects projects={userData.data.projects} />
      </div>
      <div className="col-span-3">
        <UserTable users={team} clickable tableHeader={usersHeader} />
      </div>
    </div>
  );
}

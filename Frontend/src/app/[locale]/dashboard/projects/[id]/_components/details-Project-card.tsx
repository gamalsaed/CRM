"use client";

import { useRouter } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { getUsersAction } from "@/shared/lib/actions/user.action";
import { deleteProjectAction } from "@/shared/lib/actions/projects.action";
import { restrictTo } from "@/shared/lib/utils/restrictTo";

import { Separator } from "@/components/ui/separator";
import { AssignDialog } from "@/shared/components/assign-dialog";
import DeleteDialog from "@/shared/components/delete-dialog";
import ProjectForm from "../../_components/project-form";

import {
  Pencil,
  UserCog,
  Trash2,
  BookMarked,
  LayoutList,
  Users,
  ShieldCheck,
} from "lucide-react";
import AssignUsersToProject from "./assign-user-to-project";

type ProjectCardProps = {
  logo?: string;
  name: string;
  description?: string;
  createdAt: string;
  status: string;
  totalLeads: number;
  assignees: number;
  teamLeader: string;
  id: string;
  teamIds: string[];
};

type StatItemProps = {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: string | number;
  bold?: boolean;
  badge?: boolean;
  status?: string;
};

function StatItem({ icon, bg, label, value, bold, badge, status }: StatItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-gray-400">{label}</span>
        {badge ? (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit mt-0.5 ${
              status === "Active" || status === "نشط"
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {value}
          </span>
        ) : (
          <span
            className={`text-sm truncate ${bold ? "font-semibold text-gray-800" : "font-medium text-gray-700"}`}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

export function DetailsProjectCard({
  logo,
  name,
  description,
  createdAt,
  status,
  totalLeads,
  assignees,
  teamLeader,
  id,
  teamIds,
}: ProjectCardProps) {
  const t = useTranslations("DetailsProjectCard");
  const { data } = useSession();
  const router = useRouter();

  const { data: users } = useQuery({
    queryKey: ["Users-team-leader"],
    queryFn: async () => {
      const result = await getUsersAction("role=team leader");
      return result;
    },
    enabled: data?.user.role === "admin",
  });

  function backStep() {
    router.back();
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {logo ? (
              <img src={logo} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-gray-400">{name[0]}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-gray-900">{name}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  status === "Active" || status === "نشط"
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {status}
              </span>
            </div>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              {t("created")} {createdAt}
            </div>
          </div>
        </div>

        {restrictTo(data?.user?.role!, "admin") && (
          <div className="flex items-center gap-2 flex-wrap">
            <ProjectForm name={name} description={description} method="PATCH" id={id}>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 text-xs font-medium hover:bg-blue-50 transition-colors">
                <Pencil size={13} />
                {t("editProject")}
              </button>
            </ProjectForm>
            {users?.data && (
              <AssignDialog
                data={users.data.query}
                ids={id}
                target="team leader"
                successMsg={t("assignTLSuccess")}
              >
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors">
                  <UserCog size={13} />
                  {t("assignTeamLeader")}
                </button>
              </AssignDialog>
            )}
            <DeleteDialog
              args={[id]}
              afterSuccess={backStep}
              deleteFn={deleteProjectAction}
              successMsg={t("deleteSuccess")}
              failMsg={t("deleteFailMsg")}
              title={t("deleteTitle")}
              description={t("deleteDescription")}
            >
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors">
                <Trash2 size={13} />
                {t("deleteProject")}
              </button>
            </DeleteDialog>
            <AssignUsersToProject projectId={id} currentTeamIds={teamIds}>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors">
                <UserCog size={13} />
                {t("assignUsers")}
              </button>
            </AssignUsersToProject>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100" />

      <div className="grid max-md:grid-cols-2 sm:grid-cols-7 gap-3">
        <StatItem
          icon={<BookMarked size={16} className="text-blue-500" />}
          bg="bg-blue-50"
          label={t("totalLeads")}
          value={totalLeads}
        />
        <Separator orientation="vertical" className="max-md:hidden" />
        <StatItem
          icon={<LayoutList size={16} className="text-green-500" />}
          bg="bg-green-50"
          label={t("assignees")}
          value={assignees}
        />
        <Separator orientation="vertical" className="max-md:hidden" />
        <StatItem
          icon={<Users size={16} className="text-purple-500" />}
          bg="bg-purple-50"
          label={t("teamLeader")}
          value={teamLeader}
          bold
        />
        <Separator orientation="vertical" className="max-md:hidden" />
        <StatItem
          icon={<ShieldCheck size={16} className="text-orange-500" />}
          bg="bg-orange-50"
          label={t("status")}
          value={status}
          badge
          status={status}
        />
      </div>
    </div>
  );
}

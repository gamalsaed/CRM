import stc from "string-to-color";
import { cn } from "@/shared/lib/utils/utils";
import { formatDate } from "@/shared/lib/utils/formateDate";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  type LucideIcon,
  ChartNoAxesCombined,
  Headset,
  BriefcaseBusiness,
  Mail,
  Phone,
  Users,
  CalendarIcon,
} from "lucide-react";

import { User, LeadType, ProjectType } from "@/shared/lib/types/app-data.t";

type UserDetailsProps = {
  user: User;
  projects: ProjectType[] | [];
  leads: LeadType[] | [];
};

type StateCardProps = {
  label: string;
  value: string;
  Icon: LucideIcon;
};

function StateCard({ label, value, Icon }: StateCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 w-full flex flex-col justify-around max-sm:flex-row max-sm:items-center max-sm:justify-between">
      <div className="bg-primary-50 w-fit p-3 rounded-full">
        <Icon className="text-primary-400 " />
      </div>
      <div className="text-gray-500">{label}</div>
      <div className="text-3xl font-semibold">{value}</div>
    </div>
  );
}

export default function UserDetails({
  user,
  leads,
  projects,
}: UserDetailsProps) {
  const color = stc(user.email);

  const leadsArray =
    user.role === "team leader"
      ? projects.flatMap((project) => project.leads)
      : leads;

  const qualifiedLeads = leadsArray.filter(
    (lead) => lead.status === "qualified",
  );
  const userState = [
    {
      label: "Assigned Leads",
      value: leadsArray.length.toString(),
      Icon: Headset,
    },
    {
      label: "Active Projects",
      value: projects.length.toString(),
      Icon: BriefcaseBusiness,
    },
    {
      label: "Team Members",
      value: projects.flatMap((project) => project.team).length.toString(),
      Icon: Users,
    },
    {
      label: "Conversion Rate",
      value:
        qualifiedLeads.length === 0
          ? `0%`
          : `${(qualifiedLeads.length / leadsArray.length) * 100}%`,
      Icon: ChartNoAxesCombined,
    },
  ];

  return (
    <div className="flex gap-4 max-lg:flex-col">
      <div className="border border-gray-200 rounded-xl p-5 w-2/5 max-lg:w-full">
        <div className="flex gap-5">
          <div
            style={{ backgroundColor: color }}
            className={cn(
              "text-white flex items-center justify-center text-5xl font-extrabold  rounded-full w-20 h-20",
            )}
          >
            {user.name[0]}
          </div>
          <ul className="text-sm text-gray-500 flex flex-col gap-1">
            <li className="text-2xl font-semibold text-black">{user.name}</li>
            <li className=" capitalize ">
              <Badge variant="qualified" className="text-base p-3 mb-4">
                {user.role}
              </Badge>
            </li>
            <li className="flex gap-8">
              <Mail size={16} />
              {user.email}
            </li>
            <li className="flex gap-8">
              <Phone size={16} />
              {user?.phone || "-"}
            </li>
            <li className="flex gap-8">
              <Users size={16} />
              Sales Team
            </li>
            <li className="flex gap-8">
              <CalendarIcon size={16} />
              Joined {formatDate(user.createdAt)}
            </li>
          </ul>
        </div>
        <Separator className="my-2" />
        <span className="text-sm text-gray-500">
          Handles project coordination and lead follow-up
        </span>
      </div>
      <div className="flex w-3/5 gap-3 max-lg:w-full max-sm:flex-col">
        {userState.map((state) => {
          return (
            <StateCard
              key={state.label}
              value={state.value}
              Icon={state.Icon}
              label={state.label}
            />
          );
        })}
      </div>
    </div>
  );
}

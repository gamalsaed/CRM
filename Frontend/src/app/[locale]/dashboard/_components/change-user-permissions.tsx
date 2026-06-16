"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  Database,
  Info,
  Save,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils/utils";
import { updateUserRoleAction } from "@/shared/lib/actions/user.action";
import { ROLE_PERMISSIONS } from "@/shared/lib/constant";
import { Role } from "@/shared/lib/types/app-data.t";

type RoleConfig = {
  value: Role;
  label: string;
  description: string;
  icon: React.ElementType;
  iconClass: string;
  selectedClass: string;
};

const ROLES: RoleConfig[] = [
  {
    value: "admin",
    label: "Admin",
    description: "Full access to all system features",
    icon: ShieldCheck,
    iconClass: "text-blue-500",
    selectedClass: "border-blue-500 bg-blue-50",
  },
  {
    value: "team leader",
    label: "Team Leader",
    description: "Manage leads, projects and team members",
    icon: Users,
    iconClass: "text-green-500",
    selectedClass: "border-green-500 bg-green-50",
  },
  {
    value: "data entry",
    label: "Data Entry",
    description: "Create and manage lead information",
    icon: Database,
    iconClass: "text-amber-500",
    selectedClass: "border-amber-500 bg-amber-50",
  },
  {
    value: "user",
    label: "User",
    description: "View leads and project information",
    icon: User,
    iconClass: "text-purple-500",
    selectedClass: "border-purple-500 bg-purple-50",
  },
];

type Props = {
  userId: string;
  currentRole: Role;
};

export default function ChangeUserPermissions({ userId, currentRole }: Props) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);

  const permissions = ROLE_PERMISSIONS[selectedRole];
  const half = Math.ceil(permissions.length / 2);
  const leftCol = permissions.slice(0, half);
  const rightCol = permissions.slice(half);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => await updateUserRoleAction(userId, selectedRole),
    onSuccess: () => {
      toast.success("User role updated successfully", {
        position: "bottom-right",
      });
      router.refresh();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Something went wrong!", {
        position: "bottom-right",
      });
    },
  });

  const isDirty = selectedRole !== currentRole;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Permissions</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Select a role to apply the default permissions for that role. You can
          review the permissions below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Role</p>
          <div className="space-y-2">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.value;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                    isSelected
                      ? role.selectedClass
                      : "border-gray-200 bg-white hover:bg-gray-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                      isSelected ? "border-current" : "border-gray-300",
                    )}
                  >
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-current" />
                    )}
                  </span>
                  <Icon className={cn("h-5 w-5 shrink-0", role.iconClass)} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {role.label}
                    </p>
                    <p className="text-xs text-gray-500">{role.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Permissions preview */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Permissions Preview
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="space-y-2">
              {leftCol.map((perm) => (
                <div key={perm} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                  <span className="text-sm text-gray-700">{perm}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {rightCol.map((perm) => (
                <div key={perm} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                  <span className="text-sm text-gray-700">{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <Info className="h-4 w-4 shrink-0 text-blue-500" />
        <p className="text-sm text-blue-600">
          Changing the role will update the user&apos;s permissions based on the
          selected role.
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
        <Button
          type="button"
          disabled={isPending || !isDirty}
          className="rounded-lg gap-2"
          onClick={() => mutate()}
        >
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

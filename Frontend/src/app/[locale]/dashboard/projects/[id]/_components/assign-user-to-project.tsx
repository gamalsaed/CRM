"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/shared/lib/utils/utils";
import { toast } from "sonner";

import { type User } from "@/shared/lib/types/app-data.t";
import { getUsersAction } from "@/shared/lib/actions/user.action";
import { addUsersToProjectAction } from "@/shared/lib/actions/projects.action";

type Props = {
  projectId: string;
  currentTeamIds: string[];
  children?: React.ReactNode;
};

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-teal-500",
  "bg-pink-500",
  "bg-indigo-500",
];

const ROLE_BADGE_CLASS: Record<string, string> = {
  "team leader": "bg-green-100 text-green-700 border border-green-200",
  user: "bg-blue-50 text-blue-600 border border-blue-200",
  admin: "bg-purple-100 text-purple-700 border border-purple-200",
  "data entry": "bg-orange-100 text-orange-700 border border-orange-200",
};

const ROLE_LABEL: Record<string, string> = {
  "team leader": "Team Leader",
  user: "User",
  admin: "Admin",
  "data entry": "Data Entry",
};

export default function AssignUsersToProject({
  projectId,
  currentTeamIds,
  children,
}: Props) {
  const t = useTranslations("AssignUsersToProject");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set([]));
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setSelected(new Set([]));
      setSearch("");
    }
  }, [open, currentTeamIds]);

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsersAction(),
    enabled: open,
  });

  const users: User[] = data?.data?.query ?? [];
  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );

  const { mutate, isPending } = useMutation({
    mutationKey: ["assign-users-to-project", projectId],
    mutationFn: () => addUsersToProjectAction(projectId, Array.from(selected)),
    onSuccess: () => {
      setOpen(false);
      toast.success(t("successMsg"), { position: "bottom-right" });
      router.refresh();
    },
    onError: () => {
      toast.error(t("errorMsg"), { position: "bottom-right" });
    },
  });

  function toggleUser(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? <Button>{t("assignUsers")}</Button>}
      </DialogTrigger>

      <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold">
            {t("dialogTitle")}
          </DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="max-h-90 overflow-y-auto no-scrollbar px-4 pb-3">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-gray-400">
              {t("loadingUsers")}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              {t("noUsersFound")}
            </div>
          ) : (
            filtered.map((user, i) => {
              const isChecked = selected.has(user._id);
              return (
                <div
                  key={user._id}
                  onClick={() => toggleUser(user._id)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors mb-1",
                    isChecked ? "bg-primary-100" : "hover:bg-gray-50",
                  )}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleUser(user._id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0",
                      AVATAR_COLORS[i % AVATAR_COLORS.length],
                    )}
                  >
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0",
                      ROLE_BADGE_CLASS[user.role] ??
                        "bg-gray-100 text-gray-600 border border-gray-200",
                    )}
                  >
                    {ROLE_LABEL[user.role] ?? user.role}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-gray-500">
            {selected.size === 1
              ? t("selectedSingular")
              : t("selectedPlural", { count: selected.size })}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => mutate()}
              disabled={isPending || selected.size === 0}
            >
              {t("assignUsers")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

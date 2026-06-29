"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "../../../../shared/lib/types/app-data.t";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import UserDropDownActions from "@/shared/components/user-drop-down-action";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export const useUserColumns = (env: "page" | "project"): ColumnDef<User>[] => {
  const session = useSession();
  const params = useParams();
  const t = useTranslations("UsersColumns");

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            className="text-lg"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            className="text-lg"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("email")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            className="text-lg"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("phone")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.phone || "-"}</span>;
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            className="text-lg"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("role")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span className=" capitalize">{row.original.role}</span>;
      },
    },
  ];

  if (env === "project") {
    if (["admin", "team leader"].includes(session.data?.user.role!)) {
      columns.push({
        id: "actions",
        header: () => t("actions"),
        cell: ({ row }) => {
          return (
            <UserDropDownActions
              userId={row.original._id}
              projectId={params.id as string}
            />
          );
        },
      });
    }
  }

  return columns;
};

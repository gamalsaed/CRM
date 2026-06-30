"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LeadType } from "../../../../shared/lib/types/app-data.t";
import { useSession } from "next-auth/react";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { restrictTo } from "@/shared/lib/utils/restrictTo";
import DropDownActions from "@/shared/components/lead-drop-down-action";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type LeadRowType = Pick<
  LeadType,
  "_id" | "name" | "source" | "email" | "status" | "project" | "assignedTo"
>;

export const useLeadColumns = (role?: string): ColumnDef<LeadRowType>[] => {
  // Hooks
  const session = useSession();
  const router = useRouter();
  const t = useTranslations("LeadColumns");

  function handleClick(id: string) {
    router.push(`/dashboard/leads/${id}`);
  }

  const columns: ColumnDef<LeadRowType>[] = [
    {
      id: "select",
      header: ({ table }) => {
        if (restrictTo(session?.data?.user.role!, "admin")) {
          return (
            <Checkbox
              className="rounded-sm"
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          );
        }
      },
      cell: ({ row }) => {
        if (restrictTo(session?.data?.user.role!, "admin")) {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="rounded-sm "
            />
          );
        }
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            className="text-base text-gray-500"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <span
            className="cursor-pointer"
            onClick={() => handleClick(row.original._id)}
          >
            {row.original.name}
          </span>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            className="text-base text-gray-500"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("email")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <span
            className="cursor-pointer"
            onClick={() => handleClick(row.original._id)}
          >
            {row.original.email}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      cell: ({ row }) => {
        let varient:
          | "new"
          | "contacted"
          | "qualified"
          | "closed"
          | "lost"
          | "problem"
          | "solved"
          | "secondary" = "secondary";
        switch (row.original.status) {
          case "new":
            varient = "new";
            break;
          case "contacted":
            varient = "contacted";
            break;
          case "qualified":
            varient = "qualified";
            break;
          case "closed":
            varient = "closed";
            break;
          case "lost":
            varient = "lost";
            break;
          case "problem":
            varient = "problem";
            break;
          case "solved":
            varient = "solved";
            break;
          default:
            varient = "secondary";
        }
        return (
          <Badge className="rounded-full" variant={varient}>
            {row.original.status}
          </Badge>
        );
      },
      header: ({ column }) => {
        return (
          <Button
            className="text-base text-gray-500"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("status")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "project",
      accessorFn: (row) => row.project?.name ?? t("noProject"),
      header: ({ column }) => {
        return (
          <Button
            className="text-base text-gray-500"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("project")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.project?.name || t("noProject")}</span>;
      },
    },
    {
      accessorKey: "user",
      accessorFn: (row) => row.assignedTo?.name ?? t("notAssignedYet"),
      header: ({ column }) => {
        return (
          <Button
            className="text-base text-gray-500 "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("assignedTo")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <span>{row.original.assignedTo?.name || t("notAssignedYet")}</span>
        );
      },
    },
  ];

  if (
    session.data &&
    ["admin", "team leader"].includes(session.data?.user.role!)
  ) {
    columns.push({
      id: "actions",
      header: ({ column }) => (
        <span className="text-base text-gray-500">{t("actions")}</span>
      ),
      cell: ({ row }) => {
        return <DropDownActions ids={[row.original._id]} />;
      },
    });
  }

  return columns;
};

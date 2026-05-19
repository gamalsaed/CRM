"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LeadType } from "../../lib/types/app-data.t";
import { useSession } from "next-auth/react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { restrictTo } from "@/shared/lib/utils/restrictTo";
import DropDownActions from "./drop-down-action";

type LeadRowType = Pick<
  LeadType,
  "_id" | "name" | "source" | "email" | "status" | "project" | "assignedTo"
>;
export const getLeadColumns = (role?: string): ColumnDef<LeadRowType>[] => {
  const session = useSession();

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
            className="text-lg"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
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
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
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
            className="text-lg"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "project",
      header: ({ column }) => {
        return (
          <Button
            className="text-lg"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Project
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.project?.name || "No Project"}</span>;
      },
    },
    {
      accessorKey: "user",
      header: ({ column }) => {
        return (
          <Button
            className="text-lg"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <span>{row.original.assignedTo?.name || "Not assigned yet"}</span>
        );
      },
    },
    {
      id: "actions",
      header: ({ column }) => "Actions",
      cell: ({ row }) => {
        return <DropDownActions ids={[row.original._id]} />;
      },
    },
  ];

  if (role === "admin" || role === "team leader") {
    columns.push({
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => {
        return <span>{row.original.assignedTo?.name || "Not Assigned"}</span>;
      },
    });
  }

  return columns;
};

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "../../../../shared/lib/types/app-data.t";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export const getUserColumns = (): ColumnDef<User>[] => {
  const session = useSession();
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
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            className="text-lg"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone
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
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span className=" capitalize">{row.original.role}</span>;
      },
    },
  ];

  // if (["admin", "team leader"].includes(session.data?.user.role!)) {
  //   columns.push({
  //     id: "actions",
  //     header: ({ column }) => "Actions",
  //     cell: ({ row }) => {
  //       return <DropDownActions ids={[row.original._id]} />;
  //     },
  //   });
  // }

  return columns;
};

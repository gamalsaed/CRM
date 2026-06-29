"use client";
import React from "react";
import { DataTable } from "../../../../shared/components/data-table";
import { useUserColumns } from "./users-columns";
import { User } from "@/shared/lib/types/app-data.t";

type UserTableProps = {
  users: User[];
  clickable?: boolean;
  tableHeader?: React.ReactNode;
  env: "page" | "project";
};

/**
 * Wrapper around DataTable for user data.
 * When `clickable` is true, clicking a row navigates to the employee detail page.
 */
export default function UserTable({
  users,
  clickable = false,
  tableHeader,
  env,
}: UserTableProps) {
  const columns = useUserColumns(env);
  return (
    <div className="mt-4">
      <DataTable
        data={users}
        tableHead={tableHeader}
        clickable={clickable}
        columns={columns}
      />
    </div>
  );
}

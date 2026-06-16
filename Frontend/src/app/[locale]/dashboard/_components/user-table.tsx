"use client";
import React from "react";
import { DataTable } from "../../../../shared/components/data-table";
import { getUserColumns } from "./users-columns";
import { User } from "@/shared/lib/types/app-data.t";

type UserTableProps = {
  users: User[];
  clickable?: boolean;
  tableHeader?: React.ReactNode;
};

export default function UserTable({
  users,
  clickable = false,
  tableHeader,
}: UserTableProps) {
  const columns = getUserColumns();
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

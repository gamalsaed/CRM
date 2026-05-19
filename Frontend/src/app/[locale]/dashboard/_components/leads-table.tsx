"use client";

import { DataTable } from "@/shared/components/leads-Table/data-table";
import { getLeadColumns } from "@/shared/components/leads-Table/columns";
import { LeadType } from "@/shared/lib/types/app-data.t";
export default function LeadsTable({ leads }: { leads: LeadType[] }) {
  const columns = getLeadColumns();
  return (
    <div className=" mt-4">
      <DataTable data={leads} columns={columns} />
    </div>
  );
}

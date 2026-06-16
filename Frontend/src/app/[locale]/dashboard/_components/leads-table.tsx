"use client";

import { DataTable } from "@/shared/components/data-table";
import { getLeadColumns } from "@/app/[locale]/dashboard/_components/lead-columns";
import { LeadType } from "@/shared/lib/types/app-data.t";
export default function LeadsTable({
  leads,
  env,
}: {
  leads: LeadType[];
  env: "home" | "project";
}) {
  const columns = getLeadColumns();
  return (
    <div className=" mt-4">
      {env === "home" && (
        <h1 className="text-3xl font-bold text-primary-500 my-4">Leads</h1>
      )}
      <DataTable data={leads} columns={columns} />
    </div>
  );
}

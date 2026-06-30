"use client";

import { Button } from "@/components/ui/button";
import type { LeadType } from "@/shared/lib/types/app-data.t";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { useTranslations } from "next-intl";

export default function DownloadLeads({ leads }: { leads: LeadType[] }) {
  const t = useTranslations("LeadsPage");

  function exportLeads() {
    const formattedLeads = leads.map((lead) => ({
      Name: lead.name,
      Phone: lead.phone,
      WhatsApp: lead.whatsApp || "",
      Email: lead.email,
      Status: lead.status,
    }));

    const sheet = XLSX.utils.json_to_sheet(formattedLeads);

    sheet["!cols"] = [
      { wch: 25 }, // Name
      { wch: 20 }, // Phone
      { wch: 20 }, // WhatsApp
      { wch: 30 }, // Email
      { wch: 15 }, // Status
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Leads");

    XLSX.writeFile(workbook, "leads.xlsx");
  }

  return (
    <Button variant="outline" className="w-32" onClick={exportLeads}>
      <Upload />
      {t("export")}
    </Button>
  );
}

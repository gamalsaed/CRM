"use client";

import { LeadFormValues } from "@/shared/lib/schemas/leads.s";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type PreviewStepProps = {
  leads: LeadFormValues[];
  next: () => void;
};

export default function PreviewStep({ leads, next }: PreviewStepProps) {
  const t = useTranslations("PreviewStep");

  return (
    <div>
      <div className="w-full max-h-96 overflow-y-auto overflow-x-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              {([t("name"), t("email"), t("phone"), t("source")] as string[]).map((col) => (
                <th
                  key={col}
                  className="px-6 py-4 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-gray-400"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => (
              <tr
                key={i}
                className={
                  i !== leads.length - 1 ? "border-b border-gray-100" : ""
                }
              >
                <td className="px-6 py-5 text-[15px] font-semibold text-gray-900">
                  {lead.name}
                </td>
                <td className="px-6 py-5 font-mono text-[13px] text-gray-500">
                  {lead.email}
                </td>
                <td className="px-6 py-5 font-mono text-[13px] text-gray-500">
                  {lead.phone || "—"}
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 font-mono text-[12px] text-gray-600">
                    {lead.source}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <Button className="mt-3 w-fit px-4" onClick={next}>
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}

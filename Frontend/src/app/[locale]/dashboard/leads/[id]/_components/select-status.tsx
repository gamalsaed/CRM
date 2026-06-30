"use client";

import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadType } from "@/shared/lib/types/app-data.t";
import { cn } from "@/shared/lib/utils/utils";
import { useUpdateLead } from "@/shared/hooks/use-update-lead";
import { useTranslations } from "next-intl";

interface StatusConfig {
  key: LeadType["status"];
  dot: string;
  trigger: string;
  item: string;
}

const STATUS_CONFIG: Record<LeadType["status"], Omit<StatusConfig, "key">> = {
  new: {
    dot: "#10B981",
    trigger:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    item: "#047857",
  },
  contacted: {
    dot: "#3B82F6",
    trigger: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    item: "#1D4ED8",
  },
  qualified: {
    dot: "#8B5CF6",
    trigger:
      "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
    item: "#6D28D9",
  },
  closed: {
    dot: "#6B7280",
    trigger: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200",
    item: "#374151",
  },
  lost: {
    dot: "#F43F5E",
    trigger: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
    item: "#BE123C",
  },
  problem: {
    dot: "#92400E",
    trigger: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    item: "#B45309",
  },
  solved: {
    dot: "#14B8A6",
    trigger: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
    item: "#0F766E",
  },
};

const STATUSES = Object.keys(STATUS_CONFIG) as LeadType["status"][];

interface LeadStatusSelectProps {
  value: LeadType["status"];
  onChange: (value: LeadType["status"]) => void;
}

export function LeadStatusSelect({ value, onChange }: LeadStatusSelectProps) {
  const t = useTranslations("LeadStatus");
  const current = STATUS_CONFIG[value];
  const params: { id: string } = useParams();
  const { updateLead } = useUpdateLead({
    successMessage: t("successMessage"),
  });

  function handleChange(v: LeadType["status"]) {
    onChange(v);
    updateLead({ body: { status: v }, leadId: params.id });
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          "w-fit gap-2 rounded-full px-3 py-1 text-sm font-medium shadow-none focus:ring-0",
          current.trigger,
        )}
      >
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="rounded-lg">
        {STATUSES.map((status) => {
          const config = STATUS_CONFIG[status];
          return (
            <SelectItem
              key={status}
              value={status}
              className={`text-sm font-medium cursor-pointer`}
              style={{ color: config.item }}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn("h-2 w-2 rounded-full ")}
                  style={{ background: config.dot }}
                />
                {t(status)}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

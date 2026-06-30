"use client";

import { Layers, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils/utils";
import { LeadFormValues } from "@/shared/lib/schemas/leads.s";
import { useLeads } from "@/shared/hooks/use-leads";
import { useTranslations } from "next-intl";

interface LeadsToolbarProps {
  leads: LeadFormValues[] | [];
  clearFn: () => void;
}

export default function LeadsToolbar({ leads, clearFn }: LeadsToolbarProps) {
  const t = useTranslations("LeadsToolbar");
  const { mutateLeads, isPending } = useLeads({ actionAfter: clearFn });

  function handleSubmit() {
    if (leads.length >= 1) mutateLeads(leads);
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-card px-4 py-3",
        "sm:flex-row sm:items-center sm:justify-between mt-10  ",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Layers className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">
            {t("leadsReady", { count: leads?.length })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" className="rounded-xl" onClick={clearFn}>
          <X className="size-4" />
          {t("clearAll")}
        </Button>

        <Button
          className="rounded-xl w-fit"
          disabled={isPending || !leads?.length}
          onClick={handleSubmit}
        >
          <Check className="size-4" />
          {isPending ? t("saving") : t("saveAllLeads")}
        </Button>
      </div>
    </div>
  );
}

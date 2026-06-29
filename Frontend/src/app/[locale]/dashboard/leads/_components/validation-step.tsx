"use client";

import React from "react";
import { LeadFormValues } from "@/shared/lib/schemas/leads.s";
import StatCard from "./state-card";
import ErrorRecord from "./error-record";
import { Button } from "@/components/ui/button";
import { InvalidLead } from "@/shared/lib/utils/validate-leads";
import { useTranslations } from "next-intl";

type ValidationStepProps = {
  validLeads?: LeadFormValues[];
  invalidLeads?: InvalidLead[];
  isPending: boolean;
  next: () => void;
};

export default function ValidationStep({
  validLeads = [],
  invalidLeads = [],
  isPending,
  next,
}: ValidationStepProps) {
  const t = useTranslations("ValidationStep");

  return (
    <div>
      <div className="flex gap-4">
        <StatCard
          variant="success"
          count={validLeads.length}
          label={t("validRows")}
        />
        <StatCard
          variant="error"
          count={invalidLeads.length}
          label={t("rowsWithErrors")}
        />
      </div>
      <div className="flex flex-col gap-2 my-2 max-h-96 overflow-y-auto">
        {invalidLeads.map((rec, i) => {
          return (
            <ErrorRecord
              key={i}
              name={
                rec.data?.name || rec.data?.email || `Row Number ${rec.row}`
              }
              value={rec.errors[0].field}
              message={rec.errors[0].message}
            />
          );
        })}
      </div>
      <div className="flex justify-end">
        <Button className="w-fit" disabled={isPending} onClick={next}>
          {isPending ? t("saving") : t("importLeads", { count: validLeads.length })}
        </Button>
      </div>
    </div>
  );
}

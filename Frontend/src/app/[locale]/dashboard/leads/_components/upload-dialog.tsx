"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useLeads } from "@/shared/hooks/use-leads";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { LeadFormValues } from "@/shared/lib/schemas/leads.s";

import UploadStep from "./upload-step";
import PreviewStep from "./preview-step";
import ValidationStep from "./validation-step";
import FinalStep from "./final-step";

import { validateLeads } from "@/shared/lib/utils/validate-leads";

export default function UploadDialog() {
  const t = useTranslations("UploadDialog");
  const [step, setStep] = useState<number>(1);
  const [leads, setLeads] = useState<LeadFormValues[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  let leadsState: ReturnType<typeof validateLeads> | undefined;

  const { mutateLeads, isPending, error, isSuccess } = useLeads({
    actionAfter: () => {
      setStep(4);
      router.refresh();
    },
  });

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setLeads([]);
      }, 500);
    }
  }, [open]);

  if (leads.length > 0) {
    leadsState = validateLeads(leads);
  }

  function handleDone() {
    setOpen(false);
    setLeads([]);
  }

  let stepComponent;

  switch (step) {
    case 1:
      stepComponent = (
        <UploadStep next={() => setStep(2)} setLeads={setLeads} />
      );
      break;

    case 2:
      stepComponent = <PreviewStep leads={leads} next={() => setStep(3)} />;
      break;

    case 3:
      stepComponent = (
        <ValidationStep
          validLeads={leadsState?.validLeads}
          invalidLeads={leadsState?.invalidLeads}
          next={() => mutateLeads(leadsState!.validLeads)}
          isPending={isPending}
        />
      );
      break;
    case 4:
      stepComponent = (
        <FinalStep
          message={error?.message || ""}
          importedCount={leadsState?.validLeads.length || 0}
          skippedCount={leadsState?.invalidLeads.length}
          onDone={handleDone}
          isSuccess={isSuccess}
        />
      );
      break;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-32">
          <Download />
          {t("importButton")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <section className="w-full">{stepComponent}</section>
      </DialogContent>
    </Dialog>
  );
}

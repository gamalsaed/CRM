"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

type FailProps = { message: string };

type ImportSuccessStateProps = {
  importedCount: number;
  skippedCount?: number;
  onDone: () => void;
};

function SuccessCase({
  onDone,
  importedCount,
  skippedCount = 0,
}: ImportSuccessStateProps) {
  const t = useTranslations("FinalStep");

  return (
    <div className="flex flex-col items-center px-6 py-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-950/40">
        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
      </div>

      <h3 className="text-base font-medium">{t("importComplete")}</h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {importedCount}{" "}
        {importedCount === 1 ? t("leadSingular") : t("leadPlural")}{" "}
        {t("importedSuffix")}
        {skippedCount > 0 && (
          <>
            {" "}
            {skippedCount}{" "}
            {skippedCount === 1 ? t("rowSingular") : t("rowPlural")}
          </>
        )}
      </p>

      <div className="mt-6 flex w-full items-center justify-end border-t pt-4">
        <Button onClick={onDone}>{t("done")}</Button>
      </div>
    </div>
  );
}

function FailCase({ message }: FailProps) {
  const t = useTranslations("FinalStep");

  return (
    <div className="flex flex-col items-center px-6 py-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>

      <h3 className="text-base font-medium">{t("importFailed")}</h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground" role="alert">
        {message}
      </p>

      <div className="mt-6 flex w-full items-center justify-end gap-2 border-t pt-4">
        <Button variant="outline">{t("close")}</Button>
        <Button>
          <RotateCcw className="mr-2 h-4 w-4" />
          {t("tryAgain")}
        </Button>
      </div>
    </div>
  );
}

type FinalStepProps = FailProps &
  ImportSuccessStateProps & { isSuccess: boolean };

export default function FinalStep({
  message,
  skippedCount,
  importedCount,
  onDone,
  isSuccess,
}: FinalStepProps) {
  return isSuccess
    ? SuccessCase({ onDone, importedCount, skippedCount })
    : FailCase({ message });
}

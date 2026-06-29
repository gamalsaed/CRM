"use client";

import React from "react";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("ErrorPage");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card shadow-sm p-8 flex flex-col items-center text-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle
                className="w-8 h-8 text-destructive"
                strokeWidth={1.5}
              />
            </div>
            <span className="absolute inset-0 rounded-2xl ring-2 ring-destructive/20 animate-ping [animation-duration:2s]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {error.message || t("defaultMessage")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              {t("goBack")}
            </Button>
            <Button className="flex-1 gap-2" onClick={unstable_retry}>
              <RotateCcw className="w-4 h-4" />
              {t("tryAgain")}
            </Button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {t("contactSupport")}
        </p>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-8 flex flex-col items-center text-center gap-6">
          {/* Icon */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle
                className="w-8 h-8 text-destructive"
                strokeWidth={1.5}
              />
            </div>
            {/* subtle pulse ring */}
            <span className="absolute inset-0 rounded-2xl ring-2 ring-destructive/20 animate-ping [animation-duration:2s]" />
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {error.message ||
                "An unexpected error occurred. Please try again or go back."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button className="flex-1 gap-2" onClick={unstable_retry}>
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          If this issue persists, please contact support.
        </p>
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/shared/lib/utils/utils";
import { CircleX } from "lucide-react";
import { useTranslations } from "next-intl";

type ErrorBoxProps = {
  error?: string;
  className?: string;
};

export function ErrorBox({ error, className }: ErrorBoxProps) {
  const t = useTranslations("ErrorBox");

  return (
    <p
      className={cn(
        "relative rounded-xl flex justify-center items-center min-h-10 w-full p-2.5 border border-destructive bg-destructive-50 text-sm font-regular text-destructive text-center",
        className,
      )}
    >
      {error ? error : t("fallback")}

      <span className="absolute left-[50%] top-0 -translate-x-1/2 -translate-y-1/2 text-destructive bg-white rounded-full">
        <CircleX className="" strokeWidth={1.5} size={18} />
      </span>
    </p>
  );
}

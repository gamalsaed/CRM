"use client";
import type React from "react";
import { QueryProvider } from "./react-query.p";
import { NextIntlClientProvider } from "next-intl";
import SessionProvide from "./sessionProvider";

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: "en" | "ar";
}) {
  return (
    <QueryProvider>
      <NextIntlClientProvider locale={locale}>
        <SessionProvide>{children}</SessionProvide>
      </NextIntlClientProvider>
    </QueryProvider>
  );
}

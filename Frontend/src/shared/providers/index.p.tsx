"use client";
import type React from "react";
import { QueryProvider } from "./react-query.p";
import { NextIntlClientProvider } from "next-intl";
import SessionProvide from "./sessionProvider";
import Checker from "./checker";

export function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: "en" | "ar";
  messages: Record<string, unknown>;
}) {
  return (
    <QueryProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <SessionProvide>
          <Checker>{children}</Checker>
        </SessionProvide>
      </NextIntlClientProvider>
    </QueryProvider>
  );
}

import { defineRouting } from "next-intl/routing";

/** Supported locales and routing strategy for next-intl. */
export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
});

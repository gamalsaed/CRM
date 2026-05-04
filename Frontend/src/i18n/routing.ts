import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  // A list of all locales that are supported
  //   locales: ["en", "ar"],

  // Used when no locale matches
  defaultLocale: "en",

  localePrefix: "always",
});

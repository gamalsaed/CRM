import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

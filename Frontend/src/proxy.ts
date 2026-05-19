import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

import { getToken } from "next-auth/jwt";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });

  if (request.url.includes("dashboard") && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && request.url.includes("auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

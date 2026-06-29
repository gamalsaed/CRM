"use client";

import React, { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

/**
 * Checks whether the NextAuth session token has expired.
 * Returns undefined when no expiry string is provided.
 */
function isTokenExpired(expires: string | undefined) {
  if (!expires) return;
  const expiresDate = new Date(expires).getTime();
  return expiresDate < Date.now();
}

/**
 * Provider wrapper that can enforce session-expiry sign-out.
 * Auto sign-out is currently commented out pending the "remember me" feature.
 */
export default function Checker({ children }: { children: React.ReactNode }) {
  // Hooks
  const { data } = useSession();
  const pathname = usePathname();

  // Effects
  useEffect(() => {
    // Auto sign-out when the token expires (disabled until remember-me is wired up).
    // if (!isTokenExpired(data?.expires)) {
    //   signOut();
    // }
  }, []);

  return children;
}

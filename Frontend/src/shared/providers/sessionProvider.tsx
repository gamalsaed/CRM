"use client";
import { SessionProvider } from "next-auth/react";
import type React from "react";

/** Thin wrapper that provides the NextAuth SessionProvider to the component tree. */
export default function SessionProvide({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}

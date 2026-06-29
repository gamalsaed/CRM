import type React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/** Shared QueryClient instance used across the application. */
export const queryClient = new QueryClient();

/** Wraps the app with TanStack Query's QueryClientProvider. */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import type { LoginCredintials } from "@/shared/lib/types/auth";
import { useRouter } from "@/i18n/navigation";

/**
 * Custom hook that wraps the NextAuth credentials sign-in flow.
 * Navigates to /dashboard and reloads the page on success so the session
 * cookie is picked up by the middleware without a stale cache.
 */
export function useLogin() {
  // Navigation
  const router = useRouter();

  // Mutation
  const {
    mutate: login,
    error,
    isPending,
  } = useMutation({
    mutationFn: async ({ email, password, rememberMe }: LoginCredintials) => {
      // Request
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // Conditions
      if (response && !response.ok) {
        throw new Error(response?.error ?? "Login failed");
      }
    },
    onSuccess: () => {
      router.push("/dashboard");
      location.reload();
    },
  });

  return {
    login,
    error,
    isPending,
  };
}

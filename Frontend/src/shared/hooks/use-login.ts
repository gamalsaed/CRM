import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import type { LoginCredintials } from "@/lib/types/auth";

export function useLogin() {
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
  });

  return {
    login,
    error,
    isPending,
  };
}

import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import type { LoginCredintials } from "@/shared/lib/types/auth";
import { useRouter } from "@/i18n/navigation";

export function useLogin() {
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

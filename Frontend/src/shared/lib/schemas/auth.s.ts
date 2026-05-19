import type { getTranslations } from "next-intl/server";
import * as z from "zod";

// Type of getTranslations function
export type Translations = Awaited<ReturnType<typeof getTranslations>>;

export const signUpSchema = z
  .object({
    name: z.string().min(4),
    email: z.email({
      error: (issue) => {
        issue.input === undefined || issue.input === ""
          ? "auth.email-required"
          : "auth.email-invalid";
      },
    }),
    password: z.string().min(1, "auth.password-required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email({
    error: (issue) => {
      issue.input === undefined || issue.input === ""
        ? "auth.email-required"
        : "auth.email-invalid";
    },
  }),
  password: z.string().min(1, "auth.password-required"),
  rememberMe: z.boolean(),
});

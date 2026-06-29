import type { getTranslations } from "next-intl/server";
import * as z from "zod";

/** Convenience alias for the return type of next-intl's getTranslations. */
export type Translations = Awaited<ReturnType<typeof getTranslations>>;

/** Zod schema for the sign-up form. Validates name, email, password and confirmation. */
export const signUpSchema = z
  .object({
    name: z.string().min(4),
    email: z.email({
      error: (issue) =>
        issue.input === undefined || issue.input === ""
          ? "auth.email-required"
          : "auth.email-invalid",
    }),
    password: z.string().min(1, "auth.password-required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/** Zod schema for the login form. Validates email, password and the remember-me checkbox. */
export const loginSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined || issue.input === ""
        ? "auth.email-required"
        : "auth.email-invalid",
  }),
  password: z.string().min(1, "auth.password-required"),
  rememberMe: z.boolean(),
});

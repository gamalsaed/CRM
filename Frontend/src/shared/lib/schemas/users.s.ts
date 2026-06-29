import { z } from "zod";

type T = (key: string) => string;

function makePasswordRules(t: T) {
  return z
    .string()
    .min(1, t("passwordRequired"))
    .min(8, t("passwordMin"))
    .regex(/[A-Z]/, t("passwordUppercase"))
    .regex(/[a-z]/, t("passwordLowercase"))
    .regex(/[0-9]/, t("passwordNumber"))
    .regex(/[^A-Za-z0-9]/, t("passwordSpecial"));
}

/** Factory: returns the create-user schema with translated validation messages. */
export function makeNewUserSchema(t: T) {
  return z
    .object({
      name: z
        .string()
        .min(1, t("nameRequired"))
        .min(2, t("nameMin"))
        .max(100, t("nameMax"))
        .trim(),

      email: z
        .string()
        .min(1, t("emailRequired"))
        .email(t("emailInvalid")),

      phone: z
        .string()
        .min(1, t("phoneRequired"))
        .regex(/^\+?[1-9]\d{6,14}$/, t("phoneInvalid")),

      role: z.enum(["admin", "team leader", "data entry", "user"]),

      password: makePasswordRules(t),

      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsMustMatch"),
      path: ["confirmPassword"],
    });
}

/** Factory: returns the basic-info schema with translated validation messages. */
export function makeBasicInfoSchema(t: T) {
  return z.object({
    name: z
      .string()
      .min(1, t("nameRequired"))
      .min(2, t("nameMin"))
      .max(100, t("nameMax"))
      .trim(),

    email: z
      .string()
      .min(1, t("emailRequired"))
      .email(t("emailInvalid")),

    phone: z
      .string()
      .min(1, t("phoneRequired"))
      .regex(/^\+?[1-9]\d{6,14}$/, t("phoneInvalid")),
  });
}

/** Factory: returns the admin change-password schema with translated validation messages. */
export function makeAdminChangePasswordSchema(t: T) {
  return z
    .object({
      newPassword: makePasswordRules(t),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsMustMatch"),
      path: ["confirmPassword"],
    });
}

/** Factory: returns the user change-password schema with translated validation messages. */
export function makeUserChangePasswordSchema(t: T) {
  return z
    .object({
      currentPassword: z.string().min(1, t("currentPasswordRequired")),
      newPassword: makePasswordRules(t),
      confirmPassword: z.string().min(1, t("confirmNewPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsMustMatch"),
      path: ["confirmPassword"],
    });
}

// ─── Static schemas (for type inference only) ─────────────────────────────────

const _identity = (k: string) => k;

const newUserSchema = makeNewUserSchema(_identity);
const basicInfoSchema = makeBasicInfoSchema(_identity);
const adminChangePasswordSchema = makeAdminChangePasswordSchema(_identity);
const userChangePasswordSchema = makeUserChangePasswordSchema(_identity);

export type NewUserFormValues = z.infer<typeof newUserSchema>;
export type BasicInfoValues = z.infer<typeof basicInfoSchema>;
export type AdminChangePasswordValues = z.infer<typeof adminChangePasswordSchema>;
export type UserChangePasswordValues = z.infer<typeof userChangePasswordSchema>;

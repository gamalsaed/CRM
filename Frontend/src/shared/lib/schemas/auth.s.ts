import * as z from "zod";

type T = (key: string) => string;

/** Factory: returns the login schema with translated validation messages. */
export function makeLoginSchema(t: T) {
  return z.object({
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")),
    rememberMe: z.boolean(),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof makeLoginSchema>>;

/** Factory: returns the sign-up schema with translated validation messages. */
export function makeSignUpSchema(t: T) {
  return z
    .object({
      name: z.string().min(1, t("nameRequired")).min(4, t("nameMin")),
      email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
      password: z.string().min(1, t("passwordRequired")),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsMustMatch"),
      path: ["confirmPassword"],
    });
}

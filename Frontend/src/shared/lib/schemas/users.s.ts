import { z } from "zod";

export const newUserSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be under 100 characters")
      .trim(),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please provide a valid email"),

    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\+?[1-9]\d{6,14}$/, "Please provide a valid phone number"),

    role: z.enum(["admin", "team leader", "data entry", "user"]),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
      .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
      .regex(/[0-9]/, "Must contain at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least 1 special character"),

    confirmPassword: z.string().min(1, "Please confirm the password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords are not the same!",
    path: ["confirmPassword"],
  });

export type NewUserFormValues = z.infer<typeof newUserSchema>;

export const basicInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{6,14}$/, "Please provide a valid phone number"),
});

export type BasicInfoValues = z.infer<typeof basicInfoSchema>;

const passwordRules = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
  .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
  .regex(/[0-9]/, "Must contain at least 1 number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least 1 special character");

export const adminChangePasswordSchema = z
  .object({
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, "Please confirm the password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AdminChangePasswordValues = z.infer<
  typeof adminChangePasswordSchema
>;

export const userChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, "Please confirm the new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserChangePasswordValues = z.infer<typeof userChangePasswordSchema>;

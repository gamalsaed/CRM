import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(5, "at least 5 chars"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{6,14}$/, "Please provide a valid phone number"),

  whatsApp: z
    .string()
    .min(1, "WhatsApp number is required")
    .regex(/^\+?[1-9]\d{6,14}$/, "Please provide a valid WhatsApp number")
    .or(z.literal("")),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email"),

  source: z.enum(
    ["tik tok", "snapchat", "facebook", "instagram", "recommended", "other"],
    "Chose one of them",
  ),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export const updateLeadSchema = leadSchema.extend({
  status: z.enum([
    "new",
    "contacted",
    "qualified",
    "closed",
    "lost",
    "problem",
    "solved",
  ]),
});

export type UpdateLeadValues = z.infer<typeof updateLeadSchema>;

export const noteSchema = z.object({
  note: z
    .string()
    .min(5, "Minimum 5 characters")
    .max(1000, "Maximum 1000 characters"),
});

export type NoteFormValues = z.infer<typeof noteSchema>;

export const editLeadFormSchema = leadSchema.omit({
  source: true,
});

export type EditLeadFormValues = z.infer<typeof editLeadFormSchema>;

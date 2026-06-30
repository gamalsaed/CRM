import { z } from "zod";

/** Zod schema for the create/edit project form. */
export const newProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  description: z
    .string()
    .min(20, "Name must be at least 20 characters")
    .max(500, "Description must be under 500 characters")
    .optional(),
});

export type NewProjectFormValues = z.infer<typeof newProjectSchema>;

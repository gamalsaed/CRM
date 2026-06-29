import { LeadFormValues, leadSchema } from "../schemas/leads.s";

type RawLead = {
  name: string;
  phone: string;
  whatsApp: string;
  email: string;
  source: string;
};

type ValidationIssue = {
  field: string;
  message: string;
};

export type InvalidLead = {
  row: number;
  data: RawLead;
  errors: ValidationIssue[];
};

export function validateLeads(leads: LeadFormValues[]) {
  const validLeads: LeadFormValues[] = [];
  const invalidLeads: InvalidLead[] = [];

  leads.forEach((record, index) => {
    const result = leadSchema.safeParse(record);

    if (result.success) {
      validLeads.push(result.data);
    } else {
      invalidLeads.push({
        row: index + 1,
        data: record,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
  });

  return {
    validLeads,
    invalidLeads,
  };
}
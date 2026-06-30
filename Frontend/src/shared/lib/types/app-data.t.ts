/** Represents a single CRM lead record. */
export type LeadType = {
  name: string;
  _id: string;
  phone: string;
  whatsApp: string;
  email: string;
  address: string;
  project: {
    name: string;
  };
  status:
    | "new"
    | "contacted"
    | "qualified"
    | "closed"
    | "lost"
    | "problem"
    | "solved";
  createdAt: Date;
  source:
    | "tik tok"
    | "snapchat"
    | "facebook"
    | "instagram"
    | "recommended"
    | "other";
  assignedTo: {
    name: string;
  };
  notes: {
    note: string;
    createdAt: Date;
    createdBy: string;
  };
};

/** Represents a system user (employee). */
export type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "team leader" | "admin" | "data entry";
  phone: string;
  passwordChangedAt: string;
  createdAt: string;
};

/** Represents a CRM project with its associated leads, team and leader. */
export type ProjectType = {
  _id: string;
  name: string;
  createdAt: Date;
  leads: LeadType[];
  team: User[];
  leader: User;
  createdBy: User;
};
export type Role = "admin" | "team leader" | "data entry" | "user";

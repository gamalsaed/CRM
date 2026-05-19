export type ProjectType = {
  _id: string;
  name: string;
  createdAt: Date;
  leads: string[];
  team: string[];
  leader: {
    name: string;
    email: string;
    phone: string;
    _id: string;
  };
};

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

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  passwordChangedAt: string;
  createdAt: string;
};

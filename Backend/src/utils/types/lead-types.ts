import type { ObjectId } from "mongoose";

export interface LeadSchema {
  name: string;
  phone: string;
  whatsApp: string;
  email: string;
  address: string;
  createdAt: Date;
  status: "new" | "contacted" | "qualified" | "closed";
  notes: {
    note: string;
    createdAt: Date;
    createdBy: ObjectId;
    _id: ObjectId;
  }[];
}

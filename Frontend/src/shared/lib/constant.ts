import { Role } from "./types/app-data.t";
export const ROLES = ["admin", "team leader", "data entery", "user"];
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: [
    "View Leads",
    "Create Leads",
    "Edit Leads",
    "Assign Leads",
    "Delete Leads",
    "View Projects",
    "Create Projects",
    "Edit Projects",
    "Assign Projects",
    "Delete Projects",
    "View User",
    "Delete User",
    "Edit User",
    "Assign User",
  ],
  "team leader": [
    "View Leads",
    "Create Leads",
    "Edit Leads",
    "Assign Leads",
    "Delete Leads",
    "View Projects",
    "Create Projects",
    "Edit Projects",
    "Assign Projects",
    "View User",
  ],
  "data entry": [
    "View Leads",
    "Create Leads",
    "Edit Leads",
    "View Projects",
  ],
  user: ["View Leads", "View Projects"],
};
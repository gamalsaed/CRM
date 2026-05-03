import express from "express";
import {
  getAllLeads,
  createLead,
  updateLead,
  getLead,
  deleteLead,
  addNote,
  removeNote,
  assignLeadToUser,
  assignLeadToProject,
} from "../Controllers/lead-controller";
import { restrictTo } from "../middlewares/authMiddleware";

const lead_router = express.Router();

lead_router.post("/:leadId/notes", addNote);
lead_router.delete("/:leadId/notes/:noteId", removeNote);

lead_router.patch("/assign-lead-to-project/:projectId", assignLeadToProject);

lead_router.patch(
  "/assign-to/:userId",
  restrictTo("admin", "team leader"),
  assignLeadToUser,
);

lead_router
.route("/:leadId")
.get(getLead)
.patch(updateLead)
.delete(restrictTo("admin"), deleteLead);

lead_router.route("/").get(getAllLeads).post(createLead);
export default lead_router;

import express from "express";
import {
  getAllLeads,
  createLead,
  updateLead,
  getLead,
  deleteLead,
  addNote,
  removeNote,
} from "../Controllers/lead-controller";

const lead_router = express.Router();

lead_router.post("/:leadId/notes", addNote);
lead_router.delete("/:leadId/notes/:noteId", removeNote);

lead_router.route("/").get(getAllLeads).post(createLead);
lead_router.route("/:leadId").get(getLead).patch(updateLead).delete(deleteLead);

export default lead_router;

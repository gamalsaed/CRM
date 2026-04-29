import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error";
import asyncCatch from "../utils/catch-async";
import Lead from "../Models/lead-modal";
import { LeadSchema } from "../utils/types/lead-types";
import { LEAD_FIELDS } from "../utils/constance";
import LeadAPIFeature from "../utils/features/APILeadsFeatures";

export const getAllLeads = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    const LeadFeature = new LeadAPIFeature(req.query, Lead)
      .filter()
      .fields()
      .pagination();

    const leads = await LeadFeature.query;

    res.status(200).json({
      status: "success",
      result: leads.length,
      data: {
        leads,
      },
    });
  },
);

export const getLead = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const lead = await Lead.findById(req.params.leadId);

    if (!lead) {
      return next(new AppError("Lead Not Found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        lead,
      },
    });
  },
);

export const createLead = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const new_lead = await Lead.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        lead: new_lead,
      },
    });
  },
);

export const updateLead = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const filteredBody: Partial<LeadSchema> = {};

    Object.keys(req.body).forEach((key) => {
      if (LEAD_FIELDS.includes(key)) {
        filteredBody[key as keyof LeadSchema] = req.body[key];
      }
    });

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.leadId,
      {
        ...filteredBody,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedLead) {
      return next(new AppError("Lead not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        lead: updatedLead,
      },
    });
  },
);

export const addNote = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { note, createdBy } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.leadId,
      {
        $push: {
          notes: {
            note,
            createdBy,
          },
        },
      },
      { new: true, runValidators: true },
    );

    res.status(201).json({
      status: "success",
      data: {
        lead: updatedLead,
      },
    });
  },
);
export const removeNote = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const lead = await Lead.findByIdAndUpdate(
      req.params.leadId,
      {
        $pull: { notes: { _id: req.params.noteId } },
      },
      { new: true, runValidators: true },
    );

    if (!lead) {
      return next(new AppError("Lead not found!", 404));
    }

    res.status(204).json({
      status: "success",
    });
  },
);

export const deleteLead = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    await Lead.findByIdAndDelete(req.params.leadId);

    res.status(204).json({
      status: "success",
    });
  },
);

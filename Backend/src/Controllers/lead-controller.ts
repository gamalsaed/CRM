import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error";
import asyncCatch from "../utils/catch-async";
import Lead from "../Models/lead-modal";
import { LeadSchema } from "../utils/types/lead-types";
import { LEAD_FIELDS } from "../utils/constance";
import APIFeatures from "../utils/features/APIFeatures";
import { safeBodyFields } from "../utils/safe-body";
import User from "../Models/user-modal";
import Project from "../Models/project-modal";

export const getAllLeads = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const LeadFeature = new APIFeatures<LeadSchema>(req.query, Lead, [
      ...LEAD_FIELDS,
      "createdAt",
    ])
      .filter()
      .fields()
      .pagination();

    let query = LeadFeature.query;

    if (req.user.role === "user") {
      query = LeadFeature.query
        .find({ assignedTo: req.user.id })
        .select("-assignedTo");
    }
    query = LeadFeature.query
      .find()
      .populate("project", "name")
      .populate("assignedTo");
    const leads = await query;
    res.status(200).json({
      status: "success",
      result: leads.length!,
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
    const fields = safeBodyFields<Partial<LeadSchema>>(req.body, LEAD_FIELDS);

    const new_lead = await Lead.create(fields);

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
    const fields = safeBodyFields<Partial<LeadSchema>>(req.body, LEAD_FIELDS);

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.leadId,
      {
        ...fields,
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

export const assignLeadToUser = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const person = await User.findById(req.params.userId);
    if (!person)
      return next(
        new AppError(
          "User you are trying to assign the lead to is not found!",
          404,
        ),
      );

    await Lead.updateMany(
      { _id: { $in: req.body.leads } },
      { assignedTo: req.params.userId },
    );
    res.status(203).json({ status: "success" });
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

export const assignLeadToProject = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await Project.findById(req.params.projectId);

    if (!Array.isArray(req.body.leads)) {
      return next(new AppError("Leads must be an array", 400));
    }

    const leads = await Lead.find({ _id: { $in: req.body.leads } });

    if (leads.length !== req.body.leads.length) {
      return next(new AppError("Some leads not found", 404));
    }

    if (!project)
      return next(
        new AppError(
          "Project you are trying to assign the lead to is not found!",
          404,
        ),
      );

    await Lead.updateMany(
      { _id: { $in: req.body.leads } },
      { project: req.params.projectId },
    );

    res.status(200).json({ status: "success" });
  },
);

export const getLeadsStatusStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const matchStage: any = {};

    if (req.user.role === "user") {
      matchStage.assignedTo = req.user.id;
    }

    const stats = await Lead.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(stats);
    const defaultStatuses = [
      "new",
      "contacted",
      "qualified",
      "closed",
      "lost",
      "problem",
      "solved",
    ];

    const formattedStats = defaultStatuses.map((status) => {
      const foundStatus = stats.find((item) => item._id === status);

      return {
        status,
        count: foundStatus ? foundStatus.count : 0,
      };
    });

    res.status(200).json({
      status: "success",
      data: {
        stats: formattedStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

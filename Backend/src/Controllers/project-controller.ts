import type { NextFunction, Request, Response } from "express";
import asyncCatch from "../utils/catch-async";
import AppError from "../utils/app-error";
import { safeBodyFields } from "../utils/safe-body";
import { PROJECT_FIELDS } from "../utils/constance";
import Project from "../Models/project-modal";
import User from "../Models/user-modal";

export const getAllProjects = asyncCatch(
  async (_: Request, res: Response, next: NextFunction) => {
    const projects = await Project.find().populate("leads");

    res.status(200).json({
      status: "success",
      result: projects.length,
      data: {
        projects,
      },
    });
  },
);

export const createProject = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const fields = safeBodyFields(req.body, PROJECT_FIELDS);
    const project = await Project.create(fields);

    res.status(201).json({
      status: "success",
      data: {
        project,
      },
    });
  },
);

export const getProject = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await Project.findById(req.params.projectId)
      .populate("leads")
      .populate("team", "name email")
      .populate("leader", "name email");

    if (!project) return next(new AppError("This project dosen't exist", 404));

    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  },
);

export const deleteProject = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    await Project.findByIdAndDelete({
      _id: req.params.projectId,
    });

    res.status(204).json({
      status: "success",
    });
  },
);

export const updateProject = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const fields = safeBodyFields(req.body, PROJECT_FIELDS);

    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      fields,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!project) return next(new AppError("Project not found!", 404));

    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  },
);

export const assignLeader = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    // projectId/userId
    const user = await User.findById(req.params.userId);
    if (!user) return next(new AppError("User is not exist!", 404));
    if (!["team leader", "admin"].includes(user.role))
      return next(
        new AppError(
          "You need to promote your employee first before giving him the project",
          403,
        ),
      );

    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { leader: req.params.userId },
      {
        new: true,
      },
    );

    if (!project) return next(new AppError("Project is not found!", 404));

    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  },
);

export const addUsersToProject = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    // // projectId/userId
    const users = await User.find({
      _id: { $in: req.body.users },
    });

    if (users.length !== req.body.users.length)
      return next(new AppError("Some users not found", 404));

    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { $addToSet: { team: { $each: req.body.users } } },
      {
        new: true,
      },
    );

    if (!project) return next(new AppError("Project is not found!", 404));

    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  },
);

export const removeUserFromProject = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    // projectId
    const users = await User.find({
      _id: { $in: req.body.users },
    });
    if (users.length !== req.body.users.length)
      return next(new AppError("Some users not found", 404));

    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { $pull: { team: { $in: req.body.users } } },
      {
        new: true,
      },
    );

    if (!project) return next(new AppError("Project is not found!", 404));

    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  },
);

export const myProjects = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError("Login again!", 404));

    const projects = await Project.find({
      $or: [{ leader: req.user._id }, { team: req.user._id }],
    })
      .populate("team", "name email")
      .populate("leader", "name email");

    res.status(200).json({
      status: "success",
      result: projects.length,
      data: {
        projects,
      },
    });
  },
);

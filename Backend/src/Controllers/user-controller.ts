import type { NextFunction, Request, Response } from "express";
import User from "../Models/user-modal";
import asyncCatch from "../utils/catch-async";
import { USER_FIELDS } from "../utils/constance";
import { safeBodyFields } from "../utils/safe-body";
import AppError from "../utils/app-error";
import bcrypt from "bcrypt";

export const getAllUsers = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-__v -password",
    );
    res.status(201).json({
      status: "success",
      result: users.length,
      data: {
        users,
      },
    });
  },
);

export const getUser = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.userId).select(
      "-__v -passowrd",
    );

    if (!user) return next(new AppError("User not found!", 404));

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  },
);

export const deleteUser = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndDelete(req.params.userId);

    res.status(204).json({
      status: "success",
    });
  },
);

export const getMyInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(201).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
};

export const updateUser = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let filteredBody = safeBodyFields(req.body, USER_FIELDS.slice(0, 3));

    if (req.path.endsWith("role")) {
      if (
        !req.body.role ||
        !["admin", "team leader", "data entry", "user"].includes(
          req.body.role,
        ) ||
        !req.body.userId
      ) {
        return next(new AppError("Role and User ID are required", 404));
      }
      filteredBody = { role: req.body.role };
    }

    const user = await User.findByIdAndUpdate(
      req.path.endsWith("role") ? req.body.userId : req.user._id,
      {
        ...filteredBody,
      },
      {
        runValidators: true,
        new: true,
      },
    ).select("-__v -password");

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  },
);

export const updatePassword = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    if (
      !req.body.newPassword ||
      !req.body.confirmPassword ||
      !req.body.oldPassword
    ) {
      return next(
        new AppError(
          "Password ,Confirm password and the old password are required!",
          402,
        ),
      );
    }

    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError("Login before you do that", 403));

    const isCorrect = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!isCorrect) return next(new AppError("Wrong password", 403));

    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    // const token = generateToken(user._id);
    res.status(201).json({
      status: "success",
      //   token,
    });
  },
);

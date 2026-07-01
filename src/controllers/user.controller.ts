import {Request, Response, NextFunction} from "express";

import User from "../models/user.model";

// * Get All Users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      status: "Success",
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// * Get User By ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      error.status = "fail";
      throw error;
    }

    res.status(200).json({
      success: true,
      status: "Success",
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// * Update User
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      error.status = "fail";
      throw error;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      status: "Success",
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// * Delete User
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      error.status = "fail";
      throw error;
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      status: "Success",
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
// *getAll admins
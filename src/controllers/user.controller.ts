import {Request, Response, NextFunction} from "express";

import User from "../models/user.model";

import { ApiError } from "../utils/apiError.utils";

import { sendResponse } from "../utils/sendResponse.utils";
import { catchAsync } from "../utils/catchAsyn.utils";

// * Get All Users
export const getAllUsers = catchAsync(
async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const users = await User.find();

    // res.status(200).json({
    //   success: true,
    //   status: "Success",
    //   message: "Users fetched successfully",
    //   data: users,
    // });
    sendResponse(res,{
    data: users,
    message:"Users fetched successfully",
    statusCode:200,
  });

},
);

// * Get User By ID
export const getUserById = catchAsync(
async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    // res.status(200).json({
    //   success: true,
    //   status: "Success",
    //   message: "User fetched successfully",
    //   data: user,
    // });

    sendResponse(res,{
    data: user,
    message:"Users fetched successfully",
    statusCode:200,
  });
},
);

// * Update User
export const updateUser = catchAsync(
async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // res.status(200).json({
    //   success: true,
    //   status: "Success",
    //   message: "User updated successfully",
    //   data: updatedUser,
    // });

    sendResponse(res,{
    data: updatedUser,
    message:"User updated successfully",
    statusCode:200,
    });
},
);

// * Delete User
export const deleteUser = catchAsync(
async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    await User.findByIdAndDelete(id);

    // res.status(200).json({
    //   success: true,
    //   status: "Success",
    //   message: "User deleted successfully",
    // });

    sendResponse(res,{
    data: user,
    message:"User deleted successfully",
    statusCode:200,
    });
  },
);
// *getAll admins
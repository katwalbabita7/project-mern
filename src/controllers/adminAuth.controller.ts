import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { ApiError } from "../utils/apiError.utils";
import { catchAsync } from "../utils/catchAsyn.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { compare } from "../utils/bcrypt.utils";
import { generateToken } from "../utils/jwt.utils";
import ENV_CONFIG from "../config/env.config";
import { Role } from "../@types/enum.types";

// * Admin Login
export const adminLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email) throw new ApiError("Email is required", 400);
    if (!password) throw new ApiError("Password is required", 400);

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError("Invalid email or password", 401);
    }

    // Admin and super admin only
    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
  throw new ApiError("Invalid email or password", 401);
}

    const isPasswordMatched = await compare(password, user.password);

    if (!isPasswordMatched) {
      throw new ApiError("Invalid email or password", 401);
    }

    const access_token = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    });

    // Admin Login
res.cookie("admin_access_token", access_token, {
  httpOnly: ENV_CONFIG.node_env === "development" ? false : true,
  maxAge: Number(ENV_CONFIG.cookie_expire ?? "7") * 24 * 60 * 60 * 1000,
  sameSite: ENV_CONFIG.node_env === "development" ? "lax" : "none",
  secure: ENV_CONFIG.node_env === "development" ? false : true,
  path: "/",
});

    const userData = user.toObject();
    delete (userData as any).password;

    sendResponse(res, {
      message: "Admin login successful",
      data: {
        user: userData,
        access_token,
      },
      statusCode: 200,
    });
  }
);

// * Admin Logout
export const adminLogout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
res.clearCookie("admin_access_token", {
  httpOnly: ENV_CONFIG.node_env === "development" ? false : true,
  sameSite: ENV_CONFIG.node_env === "development" ? "lax" : "none",
  secure: ENV_CONFIG.node_env === "development" ? false : true,
});

    sendResponse(res, {
      message: "Logged out successfully",
      data: null,
      statusCode: 200,
    });
  }
);
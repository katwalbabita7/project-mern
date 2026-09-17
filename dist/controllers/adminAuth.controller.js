"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogout = exports.adminLogin = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const apiError_utils_1 = require("../utils/apiError.utils");
const catchAsyn_utils_1 = require("../utils/catchAsyn.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
const enum_types_1 = require("../@types/enum.types");
// * Admin Login
exports.adminLogin = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email)
        throw new apiError_utils_1.ApiError("Email is required", 400);
    if (!password)
        throw new apiError_utils_1.ApiError("Password is required", 400);
    const user = await user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new apiError_utils_1.ApiError("Invalid email or password", 401);
    }
    // Admin and super admin only
    if (user.role !== enum_types_1.Role.ADMIN && user.role !== enum_types_1.Role.SUPER_ADMIN) {
        throw new apiError_utils_1.ApiError("Access denied. Admin only.", 403);
    }
    const isPasswordMatched = await (0, bcrypt_utils_1.compare)(password, user.password);
    if (!isPasswordMatched) {
        throw new apiError_utils_1.ApiError("Invalid email or password", 401);
    }
    const access_token = (0, jwt_utils_1.generateToken)({
        _id: user._id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
    });
    // Admin Login
    res.cookie("admin_access_token", access_token, {
        httpOnly: env_config_1.default.node_env === "development" ? false : true,
        maxAge: Number(env_config_1.default.cookie_expire ?? "7") * 24 * 60 * 60 * 1000,
        sameSite: env_config_1.default.node_env === "development" ? "lax" : "none",
        secure: env_config_1.default.node_env === "development" ? false : true,
        path: "/",
    });
    const userData = user.toObject();
    delete userData.password;
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Admin login successful",
        data: {
            user: userData,
            access_token,
        },
        statusCode: 200,
    });
});
// * Admin Logout
exports.adminLogout = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    res.clearCookie("admin_access_token", {
        httpOnly: env_config_1.default.node_env === "development" ? false : true,
        sameSite: env_config_1.default.node_env === "development" ? "lax" : "none",
        secure: env_config_1.default.node_env === "development" ? false : true,
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Logged out successfully",
        data: null,
        statusCode: 200,
    });
});

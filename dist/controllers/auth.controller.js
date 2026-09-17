"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.changeEmail = exports.changePassword = exports.deleteAccount = exports.getProfile = exports.login = exports.register = void 0;
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const user_model_1 = __importStar(require("../models/user.model"));
const apiError_utils_1 = require("../utils/apiError.utils");
const catchAsyn_utils_1 = require("../utils/catchAsyn.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
const sendEmailService_utils_1 = require("../utils/sendEmailService.utils");
const emailTemplate_utils_1 = require("../utils/emailTemplate.utils");
const enum_types_1 = require("../@types/enum.types");
const uploadFolder = "/profiles";
// * register(create user)
exports.register = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const { full_name, email, password, phone, } = req.body;
    const file = req.file;
    const user = new user_model_1.default({ full_name, email, phone });
    // * password hash
    const hashPass = await (0, bcrypt_utils_1.hash)(password);
    user.password = hashPass;
    // * handle image upload
    if (file) {
        // user.profile_image = file.path;
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
        user.profile_image = {
            path,
            publicId: public_id,
        };
    }
    else {
        user.profile_image = { ...user_model_1.DEFAULT_AVATAR };
    }
    // * save 
    await user.save();
    // * send account created email
    (0, sendEmailService_utils_1.sendEmail)({
        // to : "katwalbabita59@gmail.com",
        to: user.email,
        subject: "Account Created",
        html: (0, emailTemplate_utils_1.accountCreatedEmailHtml)({
            fullName: user.full_name,
            email: user.email,
            createdAt: user.createdAt,
        })
    });
    // * send success response
    // res.status(201).json({
    //     message:"Account created",
    //     success:true,
    //     status:"Success",
    //     data: user,
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: user,
        message: "Account Created",
        statusCode: 201,
    });
});
// * login
exports.login = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email) {
        throw new apiError_utils_1.ApiError("email is required", 400);
    }
    if (!password) {
        throw new apiError_utils_1.ApiError("password is required", 400);
    }
    // * Find user by email
    const user = await user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new apiError_utils_1.ApiError("Invalid Credentia", 400);
    }
    // * Only normal USER role allowed here
    if (user.role !== enum_types_1.Role.USER) {
        throw new apiError_utils_1.ApiError("Invalid Credentia", 400);
    }
    // * compare password
    const isPassMatched = await (0, bcrypt_utils_1.compare)(password, user.password);
    if (!isPassMatched) {
        throw new apiError_utils_1.ApiError("Invalid Credentia", 400);
    }
    // * generate JWT token
    const access_token = (0, jwt_utils_1.generateToken)({
        _id: user._id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
    });
    // * send account created email
    (0, sendEmailService_utils_1.sendEmail)({
        to: "katwalbabita59@gmail.com",
        // to:user.email,
        subject: "Login Detected",
        html: (0, emailTemplate_utils_1.loginDetectedEmailHtml)({
            fullName: user.full_name,
            email: user.email,
            loginAt: new Date(Date.now()),
        })
    });
    // * set cookie
    res.cookie('access_token', access_token, {
        httpOnly: env_config_1.default.node_env === "development" ? false : true,
        maxAge: Number(env_config_1.default.cookie_expire ?? "7") * 24 * 60 * 60 * 1000,
        sameSite: env_config_1.default.node_env === "development" ? "lax" : "none",
        secure: env_config_1.default.node_env === "development" ? false : true,
    });
    // const token = generateToken(user._id.toString());
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Login Success",
        data: {
            data: user,
            access_token,
        },
        statusCode: 201,
    });
});
// * Get Profile (Only own profile)
exports.getProfile = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new apiError_utils_1.ApiError("Please login to access this resource", 401);
    }
    const user = await user_model_1.default.findById(userId).select("-password");
    if (!user) {
        throw new apiError_utils_1.ApiError("User not found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Profile fetched successfully",
        data: user,
        statusCode: 200,
    });
});
// * Delete Account (Only own account)
exports.deleteAccount = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new apiError_utils_1.ApiError("Please login to access this resource", 401);
    }
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new apiError_utils_1.ApiError("User not found", 404);
    }
    await user_model_1.default.findByIdAndDelete(userId);
    // Clear cookie
    res.clearCookie('access_token', {
        httpOnly: env_config_1.default.node_env === "development" ? false : true,
        sameSite: env_config_1.default.node_env === "development" ? "lax" : "none",
        secure: env_config_1.default.node_env === "development" ? false : true,
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Account deleted successfully",
        data: null,
        statusCode: 200,
    });
});
// * Change Password
exports.changePassword = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;
    if (!userId) {
        throw new apiError_utils_1.ApiError("Please login to access this resource", 401);
    }
    if (!currentPassword || !newPassword) {
        throw new apiError_utils_1.ApiError("Current password and new password are required", 400);
    }
    if (newPassword.length < 6) {
        throw new apiError_utils_1.ApiError("New password must be at least 6 characters", 400);
    }
    const user = await user_model_1.default.findById(userId).select("+password");
    if (!user) {
        throw new apiError_utils_1.ApiError("User not found", 404);
    }
    // Check current password
    const isMatch = await (0, bcrypt_utils_1.compare)(currentPassword, user.password);
    if (!isMatch) {
        throw new apiError_utils_1.ApiError("Current password is incorrect", 400);
    }
    // Hash and save new password
    user.password = await (0, bcrypt_utils_1.hash)(newPassword);
    await user.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Password changed successfully",
        data: null,
        statusCode: 200,
    });
});
// * forget password
// * Change Email
exports.changeEmail = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?._id;
    const { newEmail, password } = req.body;
    if (!userId) {
        throw new apiError_utils_1.ApiError("Please login to access this resource", 401);
    }
    if (!newEmail || !password) {
        throw new apiError_utils_1.ApiError("New email and current password are required", 400);
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
        throw new apiError_utils_1.ApiError("Please provide a valid email", 400);
    }
    const user = await user_model_1.default.findById(userId).select("+password");
    if (!user) {
        throw new apiError_utils_1.ApiError("User not found", 404);
    }
    // Verify password
    const isMatch = await (0, bcrypt_utils_1.compare)(password, user.password);
    if (!isMatch) {
        throw new apiError_utils_1.ApiError("Password is incorrect", 400);
    }
    // Check if new email already exists
    const emailExists = await user_model_1.default.findOne({ email: newEmail });
    if (emailExists) {
        throw new apiError_utils_1.ApiError("This email is already in use", 400);
    }
    const oldEmail = user.email;
    user.email = newEmail;
    await user.save();
    // Optional: send notification to both emails
    (0, sendEmailService_utils_1.sendEmail)({
        to: oldEmail,
        subject: "Email Changed",
        html: `<p>Your email was changed to ${newEmail}. If this wasn't you, contact support immediately.</p>`,
    });
    (0, sendEmailService_utils_1.sendEmail)({
        to: newEmail,
        subject: "Email Successfully Updated",
        html: `<p>Hello ${user.full_name}, your email has been successfully updated.</p>`,
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Email changed successfully",
        data: { email: user.email },
        statusCode: 200,
    });
});
// * Logout
exports.logout = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    res.clearCookie("access_token", {
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.getProfile = exports.login = exports.register = void 0;
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const user_model_1 = __importDefault(require("../models/user.model"));
const apiError_utils_1 = require("../utils/apiError.utils");
const catchAsyn_utils_1 = require("../utils/catchAsyn.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
const sendEmailService_utils_1 = require("../utils/sendEmailService.utils");
const emailTemplate_utils_1 = require("../utils/emailTemplate.utils");
const uploadFolder = "/profiles";
// * register(create user)
exports.register = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const { full_name, email, password, phone, } = req.body;
    const file = req.file;
    //     console.log("req.file =", req.file);
    // console.log("req.body =", req.body);
    // if(!full_name){
    //     throw new ApiError("full_name is required", 400);
    // }
    // if(!email){
    //     throw new ApiError("email is required", 400);
    // }
    // if(!password){
    //     throw new ApiError("password is required", 400);
    // }
    // const user = await User.create({full_name, email, password, phone});
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
    // const { email, password } = req.body;
    //* Find user by email
    const user = await user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new apiError_utils_1.ApiError("Invalid Credentia", 400);
    }
    // * compare password
    const isPassMatched = (0, bcrypt_utils_1.compare)(password, user.password);
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
// * change password
// * forget password
// * get profile
// * change email
// * 

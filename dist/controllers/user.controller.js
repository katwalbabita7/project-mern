"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const apiError_utils_1 = require("../utils/apiError.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const catchAsyn_utils_1 = require("../utils/catchAsyn.utils");
// * Get All Users
exports.getAllUsers = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const users = await user_model_1.default.find();
    // res.status(200).json({
    //   success: true,
    //   status: "Success",
    //   message: "Users fetched successfully",
    //   data: users,
    // });
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: users,
        message: "Users fetched successfully",
        statusCode: 200,
    });
});
// * Get User By ID
exports.getUserById = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const user = await user_model_1.default.findById(id);
    if (!user) {
        throw new apiError_utils_1.ApiError("User not found", 404);
    }
    // res.status(200).json({
    //   success: true,
    //   status: "Success",
    //   message: "User fetched successfully",
    //   data: user,
    // });
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: user,
        message: "Users fetched successfully",
        statusCode: 200,
    });
});
// * Update User
exports.updateUser = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const user = await user_model_1.default.findById(id);
    if (!user) {
        throw new apiError_utils_1.ApiError("User not found", 404);
    }
    const updatedUser = await user_model_1.default.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    // res.status(200).json({
    //   success: true,
    //   status: "Success",
    //   message: "User updated successfully",
    //   data: updatedUser,
    // });
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: updatedUser,
        message: "User updated successfully",
        statusCode: 200,
    });
});
// * Delete User
exports.deleteUser = (0, catchAsyn_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const user = await user_model_1.default.findById(id);
    if (!user) {
        throw new apiError_utils_1.ApiError("User not found", 404);
    }
    await user_model_1.default.findByIdAndDelete(id);
    // res.status(200).json({
    //   success: true,
    //   status: "Success",
    //   message: "User deleted successfully",
    // });
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: user,
        message: "User deleted successfully",
        statusCode: 200,
    });
});
// *getAll admins

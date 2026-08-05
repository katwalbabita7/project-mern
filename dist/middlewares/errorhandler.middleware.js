"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const env_config_1 = __importDefault(require("../config/env.config"));
const apiError_utils_1 = require("../utils/apiError.utils");
const multer_1 = __importDefault(require("multer"));
const errorHandler = (error, req, res, next) => {
    let statusCode = error?.statusCode || 500;
    let message = error?.message || "Internal Server Error";
    let success = false;
    let status = "error";
    // Multer errors (file size, unexpected field, etc.)
    if (error instanceof multer_1.default.MulterError) {
        statusCode = 400;
        status = "fail";
        if (error.code === "LIMIT_FILE_SIZE") {
            message = "Image size is too large. Please upload an image smaller than 5MB.";
        }
        else if (error.code === "LIMIT_UNEXPECTED_FILE") {
            message = "Invalid file field name.";
        }
        else {
            message = error.message;
        }
    }
    // if ApiError
    if (error instanceof apiError_utils_1.ApiError) {
        statusCode = error.statusCode;
        message = error.message;
        status = error.status || "error";
    }
    // Common MongoDB errors
    if (error.code === 11000) {
        statusCode = 409;
        message = "Duplicate value entered";
        status = "fail";
    }
    // Validation Error
    if (error.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(error.errors)
            .map((val) => val.message)
            .join(", ");
        status = "fail";
    }
    // JWT / Authentication Errors
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Invalid or expired token. Please login again.";
        status = "error";
    }
    res.status(statusCode).json({
        success,
        status,
        message,
        data: null,
        errors: process.env.NODE_ENV === "development" ? error?.errors || null : null,
        stack: env_config_1.default.node_env === "development" ? error?.stack : null,
    });
};
exports.errorHandler = errorHandler;

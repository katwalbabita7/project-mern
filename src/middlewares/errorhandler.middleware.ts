
import { NextFunction, Request, Response } from "express";
import ENV_CONFIG from "../config/env.config";
import { ApiError } from "../utils/apiError.utils";
import multer from "multer";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = error?.statusCode || 500;
    let message = error?.message || "Internal Server Error";
    let success = false;
    let status: "error" | "fail" = "error";

    // Multer errors (file size, unexpected field, etc.)
    if (error instanceof multer.MulterError) {
        statusCode = 400;
        status = "fail";

        if (error.code === "LIMIT_FILE_SIZE") {
            message = "Image size is too large. Please upload an image smaller than 5MB.";
        } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
            message = "Invalid file field name.";
        } else {
            message = error.message;
        }
    }

    // if ApiError
    if (error instanceof ApiError) {
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
            .map((val: any) => val.message)
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
        stack: ENV_CONFIG.node_env === "development" ? error?.stack : null,
    });
};
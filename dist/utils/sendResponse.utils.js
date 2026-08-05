"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, { data, message, statusCode, meta }) => {
    res.status(statusCode).json({
        success: String(statusCode).startsWith("2"),
        message,
        data,
        ...(meta && { meta }),
        status: String(statusCode).startsWith("2")
            ? "success"
            : String(statusCode).startsWith("4")
                ? "fail"
                : "error",
    });
};
exports.sendResponse = sendResponse;

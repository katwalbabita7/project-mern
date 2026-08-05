"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    message;
    statusCode;
    status;
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
        this.status =
            statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        Error.captureStackTrace(this, ApiError);
    }
}
exports.ApiError = ApiError;

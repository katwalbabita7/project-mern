"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiError_utils_1 = require("./apiError.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
// Generate Token
const generateToken = (payload) => {
    if (!process.env.JWT_SECRET) {
        throw new apiError_utils_1.ApiError("JWT_SECRET is not defined in .env", 500);
    }
    try {
        return jsonwebtoken_1.default.sign(payload, env_config_1.default.jwt_secret, {
            expiresIn: env_config_1.default.jwt_expires_in ?? "7d",
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.generateToken = generateToken;
// Verify Token
const verifyJwtToken = (token) => {
    if (!env_config_1.default.jwt_secret) {
        throw new apiError_utils_1.ApiError("JWT_SECRET is not defined in .env", 500);
    }
    try {
        return jsonwebtoken_1.default.verify(token, env_config_1.default.jwt_secret);
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new apiError_utils_1.ApiError("Token has expired", 401);
        }
        throw new apiError_utils_1.ApiError("Invalid token", 401);
    }
};
exports.verifyJwtToken = verifyJwtToken;
// Optional: Decode without verification
// export const decodeToken = (token: string) => {
//     return jwt.decode(token);
// };

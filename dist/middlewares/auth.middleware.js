"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const apiError_utils_1 = require("../utils/apiError.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
// Extend Request type
const authenticate = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            // 1. Get token from cookies
            const access_token = req.cookies?.access_token || req.cookies?.accessToken;
            if (!access_token) {
                throw new apiError_utils_1.ApiError("Please login to access this resource", 401);
            }
            // 2. Verify token
            const decoded = (0, jwt_utils_1.verifyJwtToken)(access_token);
            // Safety check
            if (!decoded || typeof decoded === "string") {
                throw new apiError_utils_1.ApiError("Invalid token", 401);
            }
            // 3. Check Expiry (Correct Way)
            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < currentTime) {
                throw new apiError_utils_1.ApiError("Token has expired. Please login again", 401);
            }
            // Attach user data to request
            req.user = decoded;
            // 4. Role-based authorization
            if (allowedRoles.length > 0) {
                const userRole = decoded.role;
                if (!userRole || !allowedRoles.includes(userRole)) {
                    throw new apiError_utils_1.ApiError("You don't have permission to access this resource", 403);
                }
            }
            req.user = {
                _id: decoded._id,
                email: decoded.email,
                full_name: decoded.full_name,
                role: decoded.role,
            };
            next();
        }
        catch (error) {
            if (error.name === "JsonWebTokenError") {
                return next(new apiError_utils_1.ApiError("Invalid token", 401));
            }
            if (error.name === "TokenExpiredError") {
                return next(new apiError_utils_1.ApiError("Token has expired. Please login again", 401));
            }
            next(error);
        }
    };
};
exports.authenticate = authenticate;

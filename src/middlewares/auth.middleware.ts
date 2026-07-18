
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.utils";
import { Role } from "../@types/enum.types";
import { verifyJwtToken } from "../utils/jwt.utils";

// Extend Request type


export const authenticate = (allowedRoles: Role[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Get token from cookies
      const access_token = req.cookies?.access_token || req.cookies?.accessToken;

      if (!access_token) {
        throw new ApiError("Please login to access this resource", 401);
      }

      // 2. Verify token
      const decoded = verifyJwtToken(access_token);

      // Safety check
      if (!decoded || typeof decoded === "string") {
        throw new ApiError("Invalid token", 401);
      }

      // 3. Check Expiry (Correct Way)
      const currentTime = Math.floor(Date.now() / 1000); 
      if (decoded.exp && decoded.exp < currentTime) {
        throw new ApiError("Token has expired. Please login again", 401);
      }

      // Attach user data to request
      req.user = decoded;

      // 4. Role-based authorization
      if (allowedRoles.length > 0) {
        const userRole = decoded.role as Role;
        if (!userRole || !allowedRoles.includes(userRole)) {
          throw new ApiError("You don't have permission to access this resource", 403);
        }
      }

      req.user={
        _id: decoded._id,
        email: decoded.email,
        full_name: decoded.full_name,
        role : decoded.role,
      };

      next();
    } catch (error: any) {
      if (error.name === "JsonWebTokenError") {
        return next(new ApiError("Invalid token", 401));
      }
      
      if (error.name === "TokenExpiredError") {
        return next(new ApiError("Token has expired. Please login again", 401));
      }

      next(error);
    }
  };
};
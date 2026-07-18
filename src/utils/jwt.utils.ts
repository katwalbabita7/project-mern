import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ApiError } from "./apiError.utils";
import ENV_CONFIG from "../config/env.config";

// Payload Interface
interface IPayload {
    _id: mongoose.Types.ObjectId;   
    full_name: string;
    email: string;
    role?: string;                  
}

// Generate Token
export const generateToken = (payload: IPayload) => {
    if (!process.env.JWT_SECRET) {
        throw new ApiError("JWT_SECRET is not defined in .env", 500);
    }

    try{
    return jwt.sign(payload, ENV_CONFIG.jwt_secret, {
        expiresIn: (ENV_CONFIG.jwt_expires_in as any) ?? "7d",
    });
}catch(error){
console.log(error);
throw  error;
}
};

// Verify Token
export const verifyJwtToken = (token: string) => {
    if (!ENV_CONFIG.jwt_secret) {
        throw new ApiError("JWT_SECRET is not defined in .env", 500);
    }

    try {
    return jwt.verify(token, ENV_CONFIG.jwt_secret);
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError("Token has expired", 401);
    }
    throw new ApiError("Invalid token", 401);
  }
};

// Optional: Decode without verification
// export const decodeToken = (token: string) => {
//     return jwt.decode(token);
// };
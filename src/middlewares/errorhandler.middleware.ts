import { NextFunction, Request, Response } from "express";
import ENV_CONFIG from "../config/env.config";

export const errorHandler = (
    error : any,
    req:Request,
    res:Response,
    next:NextFunction,
)=>{
    const statusCode: number = error?.statusCode ?? 500;
    const message: string = error?.message ?? "Internal Server Error";
    const success: boolean = error?.error ?? false;
    const status: "error" | "Success" | "fail" = error?.status ?? "error";

    res.status(statusCode).json({
        message,
        success,
        status,
        data:null,
        stack: ENV_CONFIG.node_env ==='development' ? error?.stack : null,
    });

};
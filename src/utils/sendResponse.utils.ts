import { Response } from "express";

type TSendResponse<T = any> = {
    message: string;
    data?: T;
    statusCode: number;
    meta?: {                     
        [key: string]: any;      
    };
};

export const sendResponse = <T>(
    res: Response,
    { data, message, statusCode, meta }: TSendResponse<T>
) => {
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
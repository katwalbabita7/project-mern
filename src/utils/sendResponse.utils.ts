import { Response } from "express";

type TSendResponse<T> = {
  message: string;
  data: T;
  statusCode: number;
};

export const sendResponse = <T>(
  res: Response,
  { data, message, statusCode }: TSendResponse<T>
) => {
  res.status(statusCode).json({
    success: String(statusCode).startsWith("2"),
    message,
    data,
    status:
      String(statusCode).startsWith("2")
        ? "success"
        : String(statusCode).startsWith("4")
        ? "fail"
        : "error",
  });
};
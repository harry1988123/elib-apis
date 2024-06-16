import { HttpError } from "http-errors";
import { config } from "../config";
import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || 500;
  return res.status(status).json({
    message: err.message,
    errorStack: config.env === "development" ? err.stack : "",
  });
};
export default globalErrorHandler;

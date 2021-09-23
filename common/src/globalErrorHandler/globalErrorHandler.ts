import { NextFunction, Request, Response } from "express";
import { HTTPError } from "..";

const sendErrorDevelopment = (error: Error, res: Response) => {
  let statusCode = 500;
  let status = "error";

  if (error instanceof HTTPError) {
    statusCode = error.statusCode;
    status = error.status;
  }

  res.status(statusCode).json({
    status,
    message: error.message,
    stack: error.stack,
    error,
  });
};

const sendErrorProduction = (error: Error, res: Response) => {
  let statusCode = 500;
  let status = "error";
  if (error instanceof HTTPError) {
    statusCode = error.statusCode;
    status = error.status;
  }

  res.status(statusCode).json({
    status,
    message: error.message,
  });
};

export const globalErrorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (process.env.NODE_ENV === "development") sendErrorDevelopment(error, res);
  else sendErrorProduction(error, res);
};

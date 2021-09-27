import { NextFunction, Request, Response } from "express";
import { asyncWrapper, HTTPError } from "..";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
  path: `${__dirname}../../config.env`,
});

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader?.startsWith("Bearer")) {
      token = authorizationHeader.split(" ")[1];
    }

    if (!token)
      return next(new HTTPError("You are not logged in. Please log in.", 401));

    const userPayload = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = userPayload;

    next();
  }
);

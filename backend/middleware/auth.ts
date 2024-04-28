import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "./catchAsyncError";
import { Errorhandler } from "../utils/Errorhandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

require("dotenv").config();

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    if (!token) {
      return next(
        new Errorhandler("Please login to access this resource", 401)
      );
    }

    try {
      const decode = jwt.verify(
        token,
        process.env.ACCESS_TOKEN as string
      ) as JwtPayload;

      if (!decode) {
        return next(new Errorhandler("Unauthorized access", 401));
      }

      const user = await redis.get(decode.id);
      if (!user) {
        return next(new Errorhandler("User not found", 404));
      }

      req.user = JSON.parse(user);

      next();
    } catch (error) {
      // Handle token verification errors
      return next(new Errorhandler("Invalid access tokens", 401)); // Unauthorized
    }
  }
);

export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new Errorhandler(
          `Role : ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};

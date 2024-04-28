import { NextFunction, Request, Response } from "express";
import { Errorhandler } from "../utils/Errorhandler";
export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "INternal error";

  console.log("Error Status Code:", err.message);
  //   wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found .Invalid: ${err.path}`;
    err = new Errorhandler(message, 400);
  }
  //   Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new Errorhandler(message, 400);
  }

  //  wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is Invalid try again`;
    err = new Errorhandler(message, 400);
  }
  // jwt expired error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired try again`;
    err = new Errorhandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

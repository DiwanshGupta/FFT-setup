require("dotenv").config;
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieparser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userouter from "./routes/user.routes";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.routs";
import freeCourseRouter from "./routes/free.route";

// Body Parser
app.use(express.json({ limit: "50mb" }));

// Cookie Parser
app.use(cookieparser());

// Cors
app.use(
  cors({
    // origin: process.env.ORIGIN,
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// routes
app.use("/api/", userouter, courseRouter, orderRouter, freeCourseRouter);

// Testing APi
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is Running",
  });
});

// unknown route
app.get("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not Found`) as any;
  err.statusCode = 400;
  next(err);
});

app.use(ErrorMiddleware);

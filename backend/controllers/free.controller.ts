import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { createFreeService } from "../services/free.service";
import { Errorhandler } from "../utils/Errorhandler";
import FreeModal from "../models/free.modal";

export const uploadFreeCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      console.log(data);
      createFreeService(data, res, next);
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);
export const getSingleFreeCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseID = req.params.id;

      const course = await FreeModal.findById(courseID);
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);
export const getAllfreeCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await FreeModal.find();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

import { Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import freeModal from "../models/free.modal";

export const createFreeService = CatchAsyncError(
  async (data: any, res: Response) => {
    const course = await freeModal.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);

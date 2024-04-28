import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import OrderModal from "../models/order.model";

// create order
export const newOrder = CatchAsyncError(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await OrderModal.create(data);
    res.status(201).json({
      success: true,
      order,
    });
  }
);

// get all orders --for Admin
export const getAllOrder = async (res: Response) => {
  const order = await OrderModal.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    order,
  });
};

import { Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import CourseModal from "../models/coure.model";

// create courses
export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    const course = await CourseModal.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);

// get all course --for Admin
export const getAllCourseAdmins = async (res: Response) => {
  const course = await CourseModal.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    course,
  });
};

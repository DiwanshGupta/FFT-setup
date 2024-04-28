import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import cloudinary from "cloudinary";
import { Errorhandler } from "../utils/Errorhandler";
import { createCourse, getAllCourseAdmins } from "../services/course.service";
import CourseModal from "../models/coure.model";
import { redis } from "../utils/redis";

// upload course
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = cloudinary.v2.uploader.upload(thumbnail, {
          folder: "Courses",
        });
        data.thumbnail = {
          public_id: (await myCloud).public_id,
          url: (await myCloud).secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

// update course by id
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const data = req.body;

      // Check if thumbnail exists and has a public_id
      if (data.thumbnail && data.thumbnail.public_id) {
        // Destroy previous thumbnail
        await cloudinary.v2.uploader.destroy(data.thumbnail.public_id);

        // Upload new thumbnail
        const myCloud = await cloudinary.v2.uploader.upload(data.thumbnail, {
          folder: "Courses",
        });

        // Update data with new thumbnail information
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const course = await CourseModal.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      if (!course) {
        return next(new Errorhandler("Course not found", 404));
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

// get single course
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseID = req.params.id;
      console.log(courseID);
      const isExist = await redis.get(courseID);
      if (isExist) {
        const course = JSON.parse(isExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModal.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links "
        );
        await redis.set(courseID, JSON.stringify(course), "EX", 604800); //7days
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

// get all course
export const getAllCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allcourses");
      if (isCacheExist) {
        const courses = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const course = await CourseModal.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links "
        );

        await redis.set("allcourse", JSON.stringify(course));
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

export const getCourseIdbyUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseID = req.params.id;
      const courseExist = userCourseList?.find(
        (course: any) => course._id.toString() === courseID
      );
      console.log(courseExist);
      if (!courseExist) {
        return next(
          new Errorhandler("You are not eligible to access this course", 404)
        );
      }
      const course = await CourseModal.findById(courseID);
      console.log(course?.courseData);
      const content = course?.courseData;
      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

// get all Course -- for Admin
export const allCourseAdmins = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCourseAdmins(res);
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

// delete course by admin
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const course = await CourseModal.findById(id);
      if (!course) {
        return next(new Errorhandler("course not found", 400));
      }
      await course.deleteOne({ id });
      await redis.del(id);
      res.status(200).json({
        success: true,
        message: "course deleted successfuly",
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

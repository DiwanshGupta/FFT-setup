import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { Iorder } from "../models/order.model";
import userModel from "../models/user.model";
import { Errorhandler } from "../utils/Errorhandler";
import CourseModal from "../models/coure.model";
import { getAllOrder, newOrder } from "../services/order.service";
import ejs from "ejs";
import path from "path";
import { sendEmail } from "../utils/sendEmail";
import NotificationModal from "../models/notification.model";

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as Iorder;
      const user = await userModel.findById(req.user?._id);

      const courseExistUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );
      if (courseExistUser) {
        return next(
          new Errorhandler("You have already purchased this course", 400)
        );
      }
      const course = await CourseModal.findById(courseId);

      if (!course) {
        return next(new Errorhandler("Course Not Found", 404)); // Changed error message
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
      };

      // Send order confirmation email
      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/orderMail.ejs"),
        { order: mailData.order } // Corrected the passing of order data
      );

      // Sending email using sendEmail utility function
      try {
        if (user) {
          await sendEmail({
            email: user.email,
            subject: "Order Confirmation",
            template: "orderMail.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new Errorhandler(error.message, 500));
      }

      // Update user's courses and create a notification
      user?.courses.push(course?._id);
      await user?.save();
      await NotificationModal.create({
        user: user?._id,
        title: "New order",
        message: `You have a new order from ${course?.name}`,
      });

      course.purchased ? (course.purchased += 1) : course.purchased;
      await course.save();
      // Respond with new order data
      newOrder(data, res, next);
    } catch (error: any) {
      // Handle errors appropriately
      return next(new Errorhandler(error.message, 500));
    }
  }
);

// get all orders -- for Admin

export const allOrderAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrder(res);
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

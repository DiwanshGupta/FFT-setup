import express from "express";
import { allOrderAdmin, createOrder } from "../controllers/order.controller";
import { authorizeRole, isAuthenticated } from "../middleware/auth";
import {
  getAllfreeCourse,
  getSingleFreeCourse,
  uploadFreeCourse,
} from "../controllers/free.controller";
const freeCourseRouter = express.Router();

freeCourseRouter.post("/free", uploadFreeCourse);
freeCourseRouter.get(
  "/ajj",
  isAuthenticated,
  authorizeRole("admin"),
  allOrderAdmin
);
freeCourseRouter.get("/free-course/:id", getSingleFreeCourse);
freeCourseRouter.get("/free-courses", getAllfreeCourse);

export default freeCourseRouter;

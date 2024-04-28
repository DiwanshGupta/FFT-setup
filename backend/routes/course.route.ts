import express from "express";
import { authorizeRole, isAuthenticated } from "../middleware/auth";
import {
  allCourseAdmins,
  deleteCourse,
  editCourse,
  getAllCourse,
  getCourseIdbyUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.contoller";
const courseRouter = express.Router();

courseRouter.post(
  "/upload-course",
  isAuthenticated,
  authorizeRole("admin"),
  uploadCourse
);

courseRouter.put(
  "/update-course/:id",
  isAuthenticated,
  authorizeRole("admin"),
  editCourse
);

courseRouter.get(
  "/admin-course",
  isAuthenticated,
  authorizeRole("admin"),
  allCourseAdmins
);
courseRouter.delete(
  "/delete-course/:id",
  isAuthenticated,
  authorizeRole("admin"),
  deleteCourse
);
courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/all-course/", getAllCourse);
courseRouter.get("/get-content/:id", isAuthenticated, getCourseIdbyUser);

export default courseRouter;

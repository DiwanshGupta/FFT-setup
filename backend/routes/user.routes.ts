import express from "express";
import {
  LoginUser,
  RegisterUser,
  activateUser,
  alluserAdmin,
  deleteUser,
  getUserinfo,
  logoutUser,
  socialAuth,
  updateAccessToken,
  updateUserAdmin,
  updateUserAvatar,
  updateUserInfo,
  updatepswd,
} from "../controllers/user.controller";
import { authorizeRole, isAuthenticated } from "../middleware/auth";
const userouter = express.Router();

userouter.post("/register", RegisterUser);
userouter.post("/activeuser", activateUser);
userouter.post("/login", LoginUser);
userouter.get("/refresh", updateAccessToken);
userouter.post("/social", socialAuth);
userouter.put("/update", isAuthenticated, updateUserInfo);
userouter.put("/update/pswd", isAuthenticated, updatepswd);
userouter.put("/update/avatar", isAuthenticated, updateUserAvatar);
userouter.get("/logout", isAuthenticated, authorizeRole("admin"), logoutUser);
userouter.get("/me", isAuthenticated, getUserinfo);
userouter.get(
  "/admin-users",
  isAuthenticated,
  authorizeRole("admin"),
  alluserAdmin
);
userouter.put(
  "/admin-updateRole",
  isAuthenticated,
  authorizeRole("admin"),
  updateUserAdmin
);

userouter.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizeRole("admin"),
  deleteUser
);
export default userouter;

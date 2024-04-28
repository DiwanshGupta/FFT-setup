import express from "express";
import { allOrderAdmin, createOrder } from "../controllers/order.controller";
import { authorizeRole, isAuthenticated } from "../middleware/auth";
const orderRouter = express.Router();

orderRouter.post("/order", isAuthenticated, createOrder);
orderRouter.get(
  "/admin-order",
  isAuthenticated,
  authorizeRole("admin"),
  allOrderAdmin
);

export default orderRouter;

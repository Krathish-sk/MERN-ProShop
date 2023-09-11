import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controllers/orderController.js";
import { admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(addOrderItems).get(admin, getOrders);
router.route("/myorder").get(getMyOrders);
router.route("/:id").get(getOrderById);
router.route("/:id/pay").put(updateOrderToPaid);
router.route("/:id/deliver").put(admin, updateOrderToDelivered);

export default router;

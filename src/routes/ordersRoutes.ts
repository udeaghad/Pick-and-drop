import express from "express";
import { createOrder, getOrder, getOrdersByDates, updateOrder } from "../controllers/ordersController";

const router = express.Router();

router.post("/", createOrder);
router.put("/:orderId", updateOrder)
router.get("/:orderId", getOrder)
router.get("/:companyId", getOrdersByDates)

export default router;
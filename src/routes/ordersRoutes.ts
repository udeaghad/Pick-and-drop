import express from "express";
import { createOrder, getOrder, updateOrder } from "../controllers/ordersController";

const router = express.Router();

router.post("/", createOrder);
router.put("/:orderId", updateOrder)
router.get("/:orderId", getOrder)

export default router;
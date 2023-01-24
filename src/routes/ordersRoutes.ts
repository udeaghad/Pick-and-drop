import express from "express";
import { createOrder, updateOrder } from "../controllers/ordersController";

const router = express.Router();

router.post("/", createOrder);
router.put("/:orderId", updateOrder)

export default router;
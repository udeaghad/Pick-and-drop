import express from "express";
import { createOrder } from "../controllers/ordersController";

const router = express.Router();

router.post("/", createOrder);

export default router;
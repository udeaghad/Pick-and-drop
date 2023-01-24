import express from "express";
import { createReceiver, getReceiver, updateReceiver } from "../controllers/receiversController"

const router = express.Router();

router.post("/senders/:senderId", createReceiver )
router.put("/:receiverId", updateReceiver)
router.get("/:receiverId", getReceiver)

export default router;
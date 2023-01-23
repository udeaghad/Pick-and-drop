import express from "express";
import { createReceiver, updateReceiver } from "../controllers/receiversController"

const router = express.Router();

router.post("/senders/:senderId", createReceiver )
router.put("/:receiverId", updateReceiver)

export default router;
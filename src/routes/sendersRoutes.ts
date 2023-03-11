import express from "express";
import { createSender, getSender, updateSender } from "../controllers/sendersController";

const router = express.Router();

router.post("/", createSender)
router.put("/:senderId", updateSender)
router.get("/:senderId", getSender)

export default router;
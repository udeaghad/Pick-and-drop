import express from "express";
import { createSender, updateSender } from "../controllers/sendersController";

const router = express.Router();

router.post("/", createSender)
router.put("/:senderId", updateSender)

export default router;
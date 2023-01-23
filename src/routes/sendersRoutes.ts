import express from "express";
import { createSender } from "../controllers/sendersController";

const router = express.Router();

router.post("/", createSender)

export default router;
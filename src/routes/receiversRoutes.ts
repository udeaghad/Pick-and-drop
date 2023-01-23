import express from "express";
import { createReceiver } from "../controllers/receiversController"

const router = express.Router();

router.post("/:senderId", createReceiver )

export default router;
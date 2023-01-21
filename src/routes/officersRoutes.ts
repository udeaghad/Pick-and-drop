import express from "express";
import { getAllOfficers } from "../controllers/officersController"

const router = express.Router();

router.get("/", getAllOfficers);

export default router;
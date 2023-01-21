import express from "express";
import { getAllOfficers } from "../controllers/officersController"

const router = express.Router();

router.get("/:companyId", getAllOfficers);

export default router;
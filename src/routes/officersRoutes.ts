import express from "express";
import { getAllOfficers, getOfficer } from "../controllers/officersController"

const router = express.Router();

router.get("/companies/:companyId", getAllOfficers);
router.get("/:officerId/companies/:companyId", getOfficer)

export default router;
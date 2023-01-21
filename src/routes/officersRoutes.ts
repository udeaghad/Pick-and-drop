import express from "express";
import { getAllOfficers, getOfficer, updateOfficer } from "../controllers/officersController"

const router = express.Router();

router.get("/companies/:companyId", getAllOfficers);
router.get("/:officerId/companies/:companyId", getOfficer)
router.put("/:officerId", updateOfficer)

export default router;
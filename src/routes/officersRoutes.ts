import express from "express";
import { deleteOfficer, getAllOfficers, getOfficer, updateOfficer } from "../controllers/officersController"

const router = express.Router();

router.get("/companies/:companyId", getAllOfficers);
router.get("/:officerId/companies/:companyId", getOfficer);
router.put("/:officerId", updateOfficer);
router.delete("/:officerId", deleteOfficer);

export default router;
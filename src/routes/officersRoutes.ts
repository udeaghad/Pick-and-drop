import express from "express";
import { deleteOfficer, getAllOfficers, getOfficer, updateOfficer } from "../controllers/officersController"
import { verifyToken } from "../utils/verifyToken";
const router = express.Router();

router.get("/companies/:companyId", getAllOfficers);
router.get("/:officerId/companies/:companyId", getOfficer);
router.put("/:officerId/companies/:companyId", verifyToken, updateOfficer);
router.delete("/:officerId/companies/:companyId", verifyToken, deleteOfficer);

export default router;
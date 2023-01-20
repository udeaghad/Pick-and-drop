import express from "express";
import { getAllCompanies, getCompany, updateCompany } from "../controllers/companyController";

const router = express.Router();

router.get("/", getAllCompanies);
router.get("/:companyId", getCompany);
router.put("/:companyId", updateCompany);

export default router;
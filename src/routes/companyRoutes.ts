import express from "express";
import { deleteCompany, getAllCompanies, getCompany, updateCompany } from "../controllers/companyController";

const router = express.Router();

router.get("/", getAllCompanies);
router.get("/:companyId", getCompany);
router.put("/:companyId", updateCompany);
router.delete("/:companyId", deleteCompany);

export default router;
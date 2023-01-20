import express from "express";
import { getAllCompanies, getCompany } from "../controllers/companyController";

const router = express.Router();

router.get("/", getAllCompanies);
router.get("/:companyId", getCompany)

export default router;
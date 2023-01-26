import express from "express";
import { deleteCompany, getAllCompanies, getCompany, updateCompany } from "../controllers/companyController";
import { verifyToken } from "../utils/verifyToken";
const router = express.Router();

router.get("/", getAllCompanies);
router.get("/:companyId", getCompany);
router.put("/:companyId", verifyToken, updateCompany);
router.delete("/:companyId", deleteCompany);

export default router;
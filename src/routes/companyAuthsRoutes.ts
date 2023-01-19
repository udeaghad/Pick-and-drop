import express from "express";
import { registerCompany, companyLogin, updateCompanyPassword } from "../controllers/authsController";

const router = express.Router();

router.post("/register/company", registerCompany);
router.post("/login/company", companyLogin);
router.post("/pasword/company", updateCompanyPassword);

export default router;
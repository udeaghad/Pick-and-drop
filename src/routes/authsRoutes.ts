import express from "express";
import { registerCompany, companyLogin, updateCompanyPassword } from "../controllers/authsController";
import { officerLogin, registerOfficer} from "../controllers/authsController";

const router = express.Router();

router.post("/register/company", registerCompany);
router.post("/login/company", companyLogin);
router.post("/pasword/company/:companyId", updateCompanyPassword);

router.post("/register/officer", registerOfficer);
router.post("/login/officer", officerLogin);

export default router;
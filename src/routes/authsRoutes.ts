import express from "express";
import { registerCompany, Login, updateCompanyPassword } from "../controllers/authsController";
import { registerOfficer, updateOfficerPassword} from "../controllers/authsController";
import { verifyToken } from "../utils/verifyToken";

const router = express.Router();

router.post("/register/company", registerCompany);
router.post("/login", Login);
router.post("/password/company/:companyId", verifyToken, updateCompanyPassword);

router.post("/register/officer", verifyToken, registerOfficer);
// router.post("/login/officer", officerLogin);
router.post("/password/officer/:officerId", verifyToken, updateOfficerPassword);

export default router;
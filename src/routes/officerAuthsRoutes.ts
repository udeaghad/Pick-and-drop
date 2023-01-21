import express from "express";
import { officerLogin, registerOfficer} from "../controllers/authsController";

const router = express.Router();

router.post("/officer/register", registerOfficer);
router.post("/officer/login", officerLogin);

export default router;
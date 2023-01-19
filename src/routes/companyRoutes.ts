import express from "express";
import { getAllCompanies } from "../controllers/companyController";

const router = express.Router();

router.get("/", getAllCompanies);

export default router;
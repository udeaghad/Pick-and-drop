"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyController_1 = require("../controllers/companyController");
const verifyToken_1 = require("../utils/verifyToken");
const router = express_1.default.Router();
router.get("/", companyController_1.getAllCompanies);
router.get("/:companyId", companyController_1.getCompany);
router.put("/:companyId", verifyToken_1.verifyToken, companyController_1.updateCompany);
router.delete("/:companyId", verifyToken_1.verifyToken, companyController_1.deleteCompany);
exports.default = router;

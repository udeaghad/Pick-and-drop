"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authsController_1 = require("../controllers/authsController");
const authsController_2 = require("../controllers/authsController");
const verifyToken_1 = require("../utils/verifyToken");
const router = express_1.default.Router();
router.post("/register/company", authsController_1.registerCompany);
router.post("/login/company", authsController_1.companyLogin);
router.post("/password/company/:companyId", verifyToken_1.verifyToken, authsController_1.updateCompanyPassword);
router.post("/register/officer", verifyToken_1.verifyToken, authsController_2.registerOfficer);
// router.post("/login/officer", officerLogin);
router.post("/password/officer/:officerId", verifyToken_1.verifyToken, authsController_2.updateOfficerPassword);
exports.default = router;

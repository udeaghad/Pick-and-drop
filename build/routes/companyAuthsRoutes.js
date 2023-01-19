"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authsController_1 = require("../controllers/authsController");
const router = express_1.default.Router();
router.post("/register/company", authsController_1.registerCompany);
router.post("/login/company", authsController_1.companyLogin);
router.post("/pasword/company", authsController_1.updateCompanyPassword);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const officersController_1 = require("../controllers/officersController");
const verifyToken_1 = require("../utils/verifyToken");
const router = express_1.default.Router();
router.get("/companies/:companyId", officersController_1.getAllOfficers);
router.get("/:officerId/companies/:companyId", officersController_1.getOfficer);
router.put("/:officerId/companies/:companyId", verifyToken_1.verifyToken, officersController_1.updateOfficer);
router.delete("/:officerId/companies/:companyId", verifyToken_1.verifyToken, officersController_1.deleteOfficer);
exports.default = router;

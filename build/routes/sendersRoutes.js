"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sendersController_1 = require("../controllers/sendersController");
const router = express_1.default.Router();
router.post("/", sendersController_1.createSender);
router.put("/:senderId", sendersController_1.updateSender);
router.get("/:senderId", sendersController_1.getSender);
exports.default = router;

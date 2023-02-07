"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const receiversController_1 = require("../controllers/receiversController");
const router = express_1.default.Router();
router.post("/senders/:senderId", receiversController_1.createReceiver);
router.put("/:receiverId", receiversController_1.updateReceiver);
router.get("/:receiverId", receiversController_1.getReceiver);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ordersController_1 = require("../controllers/ordersController");
const router = express_1.default.Router();
router.post("/", ordersController_1.createOrder);
router.put("/:orderId", ordersController_1.updateOrder);
router.get("/:orderId", ordersController_1.getOrder);
router.get("/companies/:companyId", ordersController_1.getOrdersByDates);
exports.default = router;

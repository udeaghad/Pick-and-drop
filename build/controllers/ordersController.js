"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersByDates = exports.getOrder = exports.updateOrder = exports.createOrder = void 0;
const OrderModel_1 = __importDefault(require("../models/OrderModel"));
const OfficerModel_1 = __importDefault(require("../models/OfficerModel"));
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = new OrderModel_1.default(req.body);
        yield order.save();
        const officer = yield OfficerModel_1.default.findById(order.officerId);
        officer === null || officer === void 0 ? void 0 : officer.updateStatus("Pending");
        officer === null || officer === void 0 ? void 0 : officer.save();
        res.status(200).json(order);
    }
    catch (err) {
        next(err);
    }
});
exports.createOrder = createOrder;
const updateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield OrderModel_1.default.findByIdAndUpdate(req.params.orderId, { $set: req.body }, { new: true });
        const status = req.body.status;
        if (status) {
            const officer = yield OfficerModel_1.default.findById(order === null || order === void 0 ? void 0 : order.officerId);
            officer === null || officer === void 0 ? void 0 : officer.updateStatus(status);
            officer === null || officer === void 0 ? void 0 : officer.save();
        }
        res.status(200).json(order);
    }
    catch (err) {
        next(err);
    }
});
exports.updateOrder = updateOrder;
const getOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield OrderModel_1.default.findById(req.params.orderId);
        if (!order)
            return res.status(400).send(`Order with ID-${req.params.orderId} does not exist`);
        res.status(200).json(order);
    }
    catch (err) {
        next(err);
    }
});
exports.getOrder = getOrder;
const getOrdersByDates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate)
            return res.status(404).send("You need to enter the startDate and endDate in the query");
        if (startDate && !endDate) {
            const todayOrder = yield OrderModel_1.default.find({
                orderDate: { $gte: Date.parse(startDate.toString()) },
                companyId: req.params.companyId,
            }).sort({ orderDate: 'desc' });
            return res.status(200).json(todayOrder);
        }
        if (startDate && endDate) {
            const orderByDateRange = yield OrderModel_1.default.find({
                orderDate: {
                    $gte: Date.parse(startDate.toString()),
                    $lt: Date.parse(endDate.toString()) + 83000000,
                },
                companyId: req.params.companyId,
            }).sort({ orderDate: 'desc' });
            return res.status(200).json(orderByDateRange);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.getOrdersByDates = getOrdersByDates;

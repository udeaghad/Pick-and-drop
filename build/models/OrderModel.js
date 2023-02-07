"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const OrderSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "Receiver",
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "Sender",
        required: true,
    },
    officerId: {
        type: Schema.Types.ObjectId,
        ref: "Officer",
        required: true,
    },
    deliveryPoint: {
        type: String,
        enum: ["Park", "Home"],
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    serviceFee: {
        type: Number,
        required: true,
    },
    RegisteredWaybill: {
        type: Boolean,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Viewed", "Received", "On Transit", "Delivered"],
        default: "Pending",
        required: true,
    },
    deliveryAgent: {
        type: String,
    },
    viewedBy: {
        type: String,
    },
    pickedBy: {
        type: String,
    },
    driverNumber: {
        type: String,
    },
    orderDate: {
        type: Date,
        default: Date.now(),
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Order", OrderSchema);

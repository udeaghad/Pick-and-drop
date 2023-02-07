"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const SenderSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    orders: {
        type: [{ type: Schema.Types.ObjectId, ref: "Order", required: true }],
    },
    customers: {
        type: [{ type: Schema.Types.ObjectId, ref: "Receiver", required: true }]
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Sender", SenderSchema);

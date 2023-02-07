"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
;
const CompanySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    offices: {
        type: [{ type: Schema.Types.ObjectId, ref: "Officers", required: true }]
    },
    logo: {
        type: String,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    isAdmin: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Company", CompanySchema);

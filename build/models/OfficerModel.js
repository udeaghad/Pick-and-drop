"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const OfficerSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        requird: true
    },
    location: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    pending: {
        type: Number,
        default: 0,
    },
    viewed: {
        type: Number,
        default: 0,
    },
    picked: {
        type: Number,
        default: 0,
    },
    transit: {
        type: Number,
        default: 0,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });
OfficerSchema.method('updateStatus', function updateStatus(status) {
    if (status === "Pending") {
        this.pending += 1;
        return;
    }
    if (status === "Viewed") {
        this.pending -= 1;
        this.viewed += 1;
        return;
    }
    if (status === "Received") {
        this.viewed -= 1;
        this.picked += 1;
        return;
    }
    if (status === "On Transit") {
        this.picked -= 1;
        this.transit += 1;
        return;
    }
    if (status === "Delivered") {
        this.transit -= 1;
        return;
    }
});
exports.default = mongoose_1.default.model("Officer", OfficerSchema);

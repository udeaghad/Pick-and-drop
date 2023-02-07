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
exports.getReceiver = exports.updateReceiver = exports.createReceiver = void 0;
const receiverModel_1 = __importDefault(require("../models/receiverModel"));
const SenderModel_1 = __importDefault(require("../models/SenderModel"));
const createReceiver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiver = new receiverModel_1.default(req.body);
        yield receiver.save();
        try {
            yield SenderModel_1.default.findByIdAndUpdate(req.params.senderId, {
                $push: { customers: receiver }
            });
        }
        catch (err) {
            next(err);
        }
        res.status(200).json(receiver);
    }
    catch (err) {
        next(err);
    }
});
exports.createReceiver = createReceiver;
const updateReceiver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiver = yield receiverModel_1.default.findByIdAndUpdate(req.params.receiverId, { $set: req.body }, { new: true });
        res.status(200).json(receiver);
    }
    catch (err) {
        next(err);
    }
});
exports.updateReceiver = updateReceiver;
const getReceiver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiver = yield receiverModel_1.default.findById(req.params.receiverId);
        if (!receiver)
            return res.status(404).send("Receiver records does not exisit");
        res.status(200).json(receiver);
    }
    catch (err) {
        next(err);
    }
});
exports.getReceiver = getReceiver;

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
exports.getSender = exports.updateSender = exports.createSender = void 0;
const SenderModel_1 = __importDefault(require("../models/SenderModel"));
const createSender = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const senderExist = yield SenderModel_1.default.findOne({ phoneNumber: req.body.phoneNumber });
        if (senderExist)
            return res.status(200).json(senderExist._doc);
        const sender = new SenderModel_1.default(req.body);
        yield sender.save();
        res.status(200).json(sender);
    }
    catch (err) {
        next(err);
    }
});
exports.createSender = createSender;
const updateSender = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sender = yield SenderModel_1.default.findByIdAndUpdate(req.params.senderId, { $set: req.body }, { new: true });
        res.status(200).json(sender);
    }
    catch (err) {
        next(err);
    }
});
exports.updateSender = updateSender;
const getSender = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sender = yield SenderModel_1.default.findById(req.params.senderId);
        if (!sender)
            return res.status(404).send("Sender Info does not exist");
        res.status(200).json(sender);
    }
    catch (err) {
        next(err);
    }
});
exports.getSender = getSender;

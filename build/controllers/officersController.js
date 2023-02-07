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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOfficer = exports.updateOfficer = exports.getOfficer = exports.getAllOfficers = void 0;
const CompanyModel_1 = __importDefault(require("../models/CompanyModel"));
const OfficerModel_1 = __importDefault(require("../models/OfficerModel"));
const getAllOfficers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allOfficers = yield OfficerModel_1.default.find({ companyId: req.params.companyId });
        const result = allOfficers.map(officer => {
            const _a = officer._doc, { password } = _a, otherDetails = __rest(_a, ["password"]);
            return otherDetails;
        });
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllOfficers = getAllOfficers;
const getOfficer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const officer = yield OfficerModel_1.default.findOne({ companyId: req.params.companyId, _id: req.params.officerId });
        if (!officer)
            return res.status(404).send("Record not found");
        const _a = officer._doc, { password } = _a, otherDetails = __rest(_a, ["password"]);
        res.status(200).json(otherDetails);
    }
    catch (err) {
        next(err);
    }
});
exports.getOfficer = getOfficer;
const updateOfficer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.cookies.id === req.params.officerId || (req.cookies.cookies.id === req.params.companyId && req.cookies.cookies.isAdmin)) {
        try {
            const _b = req.body, { password } = _b, bodyDetails = __rest(_b, ["password"]);
            const officer = yield OfficerModel_1.default.findByIdAndUpdate(req.params.officerId, { $set: bodyDetails }, { new: true });
            if (!officer)
                return res.status(400).send("Record does not exist");
            const _c = officer._doc, { password: officerPassword } = _c, otherDetails = __rest(_c, ["password"]);
            res.status(200).json(otherDetails);
        }
        catch (err) {
            next(err);
        }
    }
    else {
        res.status(401).send("You are not authorised to make changes");
    }
});
exports.updateOfficer = updateOfficer;
const deleteOfficer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.cookies.id === req.params.companyId && req.cookies.cookies.isAdmin) {
        try {
            const officer = yield OfficerModel_1.default.findById(req.params.officerId);
            yield CompanyModel_1.default.findByIdAndUpdate(officer === null || officer === void 0 ? void 0 : officer.companyId, { $pull: { offices: req.params.officerId } });
            yield (officer === null || officer === void 0 ? void 0 : officer.deleteOne());
            res.status(200).send("Officer deleted successfully");
        }
        catch (err) {
            next(err);
        }
    }
    else {
        res.status(401).send("You are not authorised to perform this action");
    }
});
exports.deleteOfficer = deleteOfficer;

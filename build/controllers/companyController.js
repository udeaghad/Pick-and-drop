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
exports.deleteCompany = exports.updateCompany = exports.getCompany = exports.getAllCompanies = void 0;
const CompanyModel_1 = __importDefault(require("../models/CompanyModel"));
const OfficerModel_1 = __importDefault(require("../models/OfficerModel"));
;
const getAllCompanies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allCompanies = yield CompanyModel_1.default.find();
        const result = allCompanies.map(company => {
            const _a = company._doc, { password } = _a, otherDetails = __rest(_a, ["password"]);
            return otherDetails;
        });
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllCompanies = getAllCompanies;
const getCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield CompanyModel_1.default.findById(req.params.companyId);
        if (!company)
            return res.status(404).send("Record not found");
        const _a = company._doc, { password } = _a, otherDetails = __rest(_a, ["password"]);
        res.status(200).json(otherDetails);
    }
    catch (err) {
        next(err);
    }
});
exports.getCompany = getCompany;
const updateCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.cookies.id === req.params.companyId && req.cookies.cookies.isAdmin) {
        try {
            const _b = req.body, { password } = _b, bodyDetails = __rest(_b, ["password"]);
            const company = yield CompanyModel_1.default.findByIdAndUpdate(req.params.companyId, { $set: bodyDetails }, { new: true });
            if (!company)
                return res.status(400).send("Record does not exist");
            const _c = company._doc, { password: companyPassword } = _c, otherDetails = __rest(_c, ["password"]);
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
exports.updateCompany = updateCompany;
const deleteCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.cookies.id === req.params.companyId && req.cookies.cookies.isAdmin) {
        try {
            yield CompanyModel_1.default.findByIdAndDelete(req.params.companyId);
            const offices = yield OfficerModel_1.default.find({ companyId: req.params.companyId });
            offices.forEach(item => item.deleteOne());
            res.status(200).send("Company deleted successfully");
        }
        catch (err) {
            next(err);
        }
    }
    else {
        res.status(401).send("You are not authorised to perform this action");
    }
});
exports.deleteCompany = deleteCompany;

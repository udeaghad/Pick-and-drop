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
exports.updateCompanyPassword = exports.companyLogin = exports.registerCompany = void 0;
const CompanyModel_1 = __importDefault(require("../models/CompanyModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
;
const secretKey = String(process.env.JWT);
const registerCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, city, state, password, logo } = req.body;
    try {
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync(password, salt);
        const newCompany = new CompanyModel_1.default({
            name,
            email,
            phoneNumber,
            city,
            state,
            password: hash,
        });
        yield newCompany.save();
        res.status(201).send("User created successfully");
    }
    catch (err) {
        next(err);
    }
});
exports.registerCompany = registerCompany;
const companyLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield CompanyModel_1.default.findOne({ email: req.body.email });
        if (!company)
            return { status: 404, message: "Company not found" };
        const validPassword = yield bcryptjs_1.default.compare(req.body.password, company.password);
        if (!validPassword)
            return { status: 404, message: "Invalid Password" };
        const token = jsonwebtoken_1.default.sign({ id: company._id }, secretKey);
        const { password } = company, otherDetails = __rest(company, ["password"]);
        res
            .cookie("cookies", token, { httpOnly: true, sameSite: "none", secure: true })
            .status(200).json(otherDetails);
    }
    catch (err) {
        next(err);
    }
});
exports.companyLogin = companyLogin;
const updateCompanyPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync(req.body.password, salt);
        yield CompanyModel_1.default.findByIdAndUpdate(req.params.companyId, { $set: { password: hash } }, { new: true });
        res.status(200).send("Password updated successfully");
    }
    catch (err) {
        next(err);
    }
});
exports.updateCompanyPassword = updateCompanyPassword;

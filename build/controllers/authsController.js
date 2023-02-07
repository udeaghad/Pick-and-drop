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
exports.companyLogin = exports.updateOfficerPassword = exports.registerOfficer = exports.updateCompanyPassword = exports.registerCompany = void 0;
const CompanyModel_1 = __importDefault(require("../models/CompanyModel"));
const OfficerModel_1 = __importDefault(require("../models/OfficerModel"));
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
        const companyExist = yield CompanyModel_1.default.findOne({ name });
        if (companyExist) {
            return res.status(200).send("Company already exist");
        }
        else {
            yield newCompany.save();
            res.status(200).send("Company created successfully");
        }
    }
    catch (err) {
        next(err);
    }
});
exports.registerCompany = registerCompany;
const updateCompanyPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.cookies.id === req.params.companyId) {
        try {
            const salt = bcryptjs_1.default.genSaltSync(10);
            const hash = bcryptjs_1.default.hashSync(req.body.password, salt);
            yield CompanyModel_1.default.findByIdAndUpdate(req.params.companyId, { $set: { password: hash } }, { new: true });
            res.status(200).send("Password updated successfully");
        }
        catch (err) {
            next(err);
        }
    }
    else {
        res.status(401).send("You are not authorised to perform this action");
    }
});
exports.updateCompanyPassword = updateCompanyPassword;
const registerOfficer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, companyId, location, phoneNumber, password } = req.body;
    if (req.cookies.cookies.id === companyId && req.cookies.cookies.isAdmin) {
        try {
            const salt = bcryptjs_1.default.genSaltSync(10);
            const hash = bcryptjs_1.default.hashSync(password, salt);
            const newOfficer = new OfficerModel_1.default({
                name,
                address,
                companyId,
                location,
                phoneNumber,
                password: hash,
            });
            const officerExist = yield OfficerModel_1.default.findOne({ phoneNumber });
            if (officerExist) {
                return res.status(200).send("Officer with the phone already exist");
            }
            else {
                yield newOfficer.save();
                yield CompanyModel_1.default.findByIdAndUpdate(companyId, { $push: { offices: newOfficer } });
                const { password } = newOfficer, officerDetail = __rest(newOfficer, ["password"]);
                res.status(200).send("Officer created successfully");
            }
        }
        catch (err) {
            next(err);
        }
    }
    else {
        res.status(401).send("You are not authorised to perform this action");
    }
});
exports.registerOfficer = registerOfficer;
const updateOfficerPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.cookies.id === req.params.officerId) {
        try {
            const salt = bcryptjs_1.default.genSaltSync(10);
            const hash = bcryptjs_1.default.hashSync(req.body.password, salt);
            yield OfficerModel_1.default.findByIdAndUpdate(req.params.officerId, { $set: { password: hash } }, { new: true });
            res.status(200).send("Password updated successfully");
        }
        catch (err) {
            next(err);
        }
    }
    else {
        res.status(401).send("You are not authorised to perform this action");
    }
});
exports.updateOfficerPassword = updateOfficerPassword;
const companyLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield CompanyModel_1.default.findOne({ email: req.body.email });
    const officer = yield OfficerModel_1.default.findOne({ phoneNumber: req.body.phoneNumber });
    // if(!company) return res.status(404).json({status: 404, message: "Company not found"}) 
    if (company) {
        try {
            const _a = company._doc, { _id, password } = _a, otherDetails = __rest(_a, ["_id", "password"]);
            const validPassword = yield bcryptjs_1.default.compare(req.body.password, password);
            if (!validPassword)
                return res.status(404).json({ status: 404, message: "Invalid Password" });
            const token = jsonwebtoken_1.default.sign({ id: _id, isAdmin: otherDetails.isAdmin }, secretKey);
            res
                .cookie("cookies", token, { httpOnly: true, sameSite: "none", secure: true })
                .status(200).json(Object.assign({ _id }, otherDetails));
        }
        catch (err) {
            next(err);
        }
    }
    else if (officer) {
        try {
            // const officer: OfficerType | null = await Officer.findOne({email: req.body.phoneNumber});
            if (!officer)
                return res.status(404).send("Account doesnot exist");
            const _b = officer._doc, { _id, password } = _b, otherDetails = __rest(_b, ["_id", "password"]);
            const validPassword = yield bcryptjs_1.default.compare(req.body.password, password);
            if (!validPassword)
                return res.status(404).send("Invalid password");
            const token = jsonwebtoken_1.default.sign({ id: _id, isAdmin: otherDetails.isAdmin }, secretKey);
            res
                .cookie("cookies", token, { httpOnly: true, sameSite: "none", secure: true })
                .status(200).json(Object.assign({ _id }, otherDetails));
        }
        catch (err) {
            next(err);
        }
    }
    else {
        res.status(404).send("Account does not exist");
    }
});
exports.companyLogin = companyLogin;

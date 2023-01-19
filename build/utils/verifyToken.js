"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = String(process.env.JWT);
const verifyToken = (req, res, next) => {
    const token = req.cookies.cookies;
    if (!token)
        return { status: 404, message: "You are not authenticated!" };
    // const decoded = jwt.verify(token, SecretKey)
    // req.cookies.cookies = decoded;
    jsonwebtoken_1.default.verify(token, secretKey, (err, user) => {
        if (err)
            return { status: 403, message: "Token is invalid" };
        req.cookies.cookies = user;
        next();
    });
};
exports.verifyToken = verifyToken;

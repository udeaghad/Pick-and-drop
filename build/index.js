"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get('/api/v1/', (req, res) => {
    res.send("Hello World");
});
/**Error Handler */
const errorHandler = (error, req, res, next) => {
    res.status(error.status || 500);
    res.send({
        success: false,
        status: error.status || 500,
        message: error.message || "Sorry! something went wrong"
    });
};
app.use(errorHandler);
app.listen(5000, () => {
    console.log("Serve is running on port 5000");
});

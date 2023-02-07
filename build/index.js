"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const port = Number(process.env.PORT) || 5001;
/**connect to database */
mongoose_1.default.set('strictQuery', true);
const databaseURL = String(process.env.MONGO);
const connect = () => {
    try {
        mongoose_1.default.connect(databaseURL);
        console.log("connected to MongoDB");
    }
    catch (error) {
        console.error(error);
    }
};
/**Check connection to MongoDB */
mongoose_1.default.connection.on("disconnected", () => {
    console.log("Database Disconnected");
});
mongoose_1.default.connection.on("connected", () => {
    console.log("Database Connected");
});
app_1.default.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
});

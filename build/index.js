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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const companyAuthsRoutes_1 = __importDefault(require("./routes/companyAuthsRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 5001;
/**Setup cors */
const allowedOrigins = ['http://localhost:3000'];
const options = {
    credentials: true,
    origin: allowedOrigins,
};
app.use((0, cors_1.default)(options));
/**Middleware to parse incoming request */
app.use(express_1.default.json());
/**connect to database */
const databaseURL = String(process.env.MONGO);
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.createConnection(databaseURL);
        console.log("connected to MongoDB");
    }
    catch (error) {
        console.error(error);
    }
});
/**Check connection to MongoDB */
mongoose_1.default.connection.on("disconnected", () => {
    console.log("Database Disconnected");
});
mongoose_1.default.connection.on("connected", () => {
    console.log("Database Connected");
});
app.get('/api/v1/', (req, res) => {
    res.send("Hello World");
});
app.use("/api/v1/auths", companyAuthsRoutes_1.default);
/**Error Handler */
const errorHandler = (error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        success: false,
        status: error.status || 500,
        message: error.message || "Sorry! something went wrong"
    });
    next();
};
app.use(errorHandler);
app.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
});

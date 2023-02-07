"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// import mongoose from "mongoose";
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authsRoutes_1 = __importDefault(require("./routes/authsRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const officersRoutes_1 = __importDefault(require("./routes/officersRoutes"));
const sendersRoutes_1 = __importDefault(require("./routes/sendersRoutes"));
const receiversRoutes_1 = __importDefault(require("./routes/receiversRoutes"));
const ordersRoutes_1 = __importDefault(require("./routes/ordersRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
/**Setup cors */
// const allowedOrigins: string[] = ['http://localhost:3000'];
// const options: cors.CorsOptions = {
//   credentials: true,
//   origin: allowedOrigins,
// };
// app.use(cors(options));
app.use((0, cors_1.default)());
/**Middleware to parse incoming request */
app.use(express_1.default.json());
/**cookie parser */
app.use((0, cookie_parser_1.default)());
app.get('/api/v1/', (req, res) => {
    res.send("Hello World");
});
app.use("/api/v1/auths", authsRoutes_1.default);
app.use("/api/v1/companies", companyRoutes_1.default);
app.use("/api/v1/officers", officersRoutes_1.default);
app.use("/api/v1/senders", sendersRoutes_1.default);
app.use("/api/v1/receivers", receiversRoutes_1.default);
app.use("/api/v1/orders", ordersRoutes_1.default);
/** API Documentation using swagger */
const swaggerDocument = yamljs_1.default.load('./swagger.yaml');
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
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
exports.default = app;

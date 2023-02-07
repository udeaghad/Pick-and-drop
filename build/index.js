"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express, { Request, Response, ErrorRequestHandler, Application} from "express";
// import dotenv from "dotenv";
// import cors from "cors";
const mongoose_1 = __importDefault(require("mongoose"));
// import cookieParser from "cookie-parser";
// import authsRoutes from "./routes/authsRoutes";
// import companyRoutes from "./routes/companyRoutes";
// import officersRoutes from "./routes/officersRoutes";
// import sendersRoutes from "./routes/sendersRoutes";
// import receiversRoutes from "./routes/receiversRoutes";
// import ordersRoutes from "./routes/ordersRoutes";
const app_1 = __importDefault(require("./app"));
// dotenv.config();
// const app: Application = express();
const port = Number(process.env.PORT) || 5001;
// /**Setup cors */
// // const allowedOrigins: string[] = ['http://localhost:3000'];
// // const options: cors.CorsOptions = {
// //   credentials: true,
// //   origin: allowedOrigins,
// // };
// // app.use(cors(options));
// app.use(cors());
// /**Middleware to parse incoming request */
// app.use(express.json());
// /**cookie parser */
// app.use(cookieParser());
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
// app.get('/api/v1/', (req: Request, res: Response) => {
//   res.send("Hello World")
// });
// app.use("/api/v1/auths", authsRoutes);
// app.use("/api/v1/companies", companyRoutes);
// app.use("/api/v1/officers", officersRoutes);
// app.use("/api/v1/senders", sendersRoutes );
// app.use("/api/v1/receivers", receiversRoutes);
// app.use("/api/v1/orders", ordersRoutes);
// /**Error Handler */
// const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
//   res.status(error.status || 500)
//   res.json({
//     success: false,
//     status: error.status || 500,
//     message: error.message || "Sorry! something went wrong"
//   })
//   next();
// }
// app.use(errorHandler);
app_1.default.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
});

import express, { Request, Response, ErrorRequestHandler, Application} from "express";
import dotenv from "dotenv";
import cors from "cors";
// import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authsRoutes from "./routes/authsRoutes";
import companyRoutes from "./routes/companyRoutes";
import officersRoutes from "./routes/officersRoutes";
import sendersRoutes from "./routes/sendersRoutes";
import receiversRoutes from "./routes/receiversRoutes";
import ordersRoutes from "./routes/ordersRoutes";

dotenv.config();
const app: Application = express();

/**Setup cors */
// const allowedOrigins: string[] = ['http://localhost:3000'];

// const options: cors.CorsOptions = {
//   credentials: true,
//   origin: allowedOrigins,
// };

// app.use(cors(options));
app.use(cors());

/**Middleware to parse incoming request */
app.use(express.json());

/**cookie parser */
app.use(cookieParser());

app.get('/api/v1/', (req: Request, res: Response) => {
  res.send("Hello World")
});
app.use("/api/v1/auths", authsRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/officers", officersRoutes);
app.use("/api/v1/senders", sendersRoutes );
app.use("/api/v1/receivers", receiversRoutes);
app.use("/api/v1/orders", ordersRoutes);


/**Error Handler */
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    success: false,
    status: error.status || 500,
    message: error.message || "Sorry! something went wrong"
  })
  next();
}

app.use(errorHandler);

export default app;
import express, { Request, Response, ErrorRequestHandler, Application} from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import companyAuthsRoutes from "./routes/companyAuthsRoutes";
import companyRoutes from "./routes/companyRoutes";

dotenv.config();
const app: Application = express();
const port: number = Number(process.env.PORT) || 5001;

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

/**connect to database */
const databaseURL: string = String(process.env.MONGO);

const connect = () => {
  try {
    mongoose.connect(databaseURL);
    console.log("connected to MongoDB")
  } catch (error) {
   console.error(error)     
  }
}

/**Check connection to MongoDB */
mongoose.connection.on("disconnected", () => {
  console.log("Database Disconnected")
})

mongoose.connection.on("connected", () => {
  console.log("Database Connected")
});



app.get('/api/v1/', (req: Request, res: Response) => {
  res.send("Hello World")
});
app.use("/api/v1/auths", companyAuthsRoutes );
app.use("/api/v1/companies", companyRoutes);

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

app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`)
});
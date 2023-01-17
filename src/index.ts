import express, { Request, Response, ErrorRequestHandler, Application} from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();
const app: Application = express();
const port: number = Number(process.env.PORT) || 5001;

/**Setup cors */
const allowedOrigins: string[] = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  credentials: true,
  origin: allowedOrigins,
};

app.use(cors(options));

/**Middleware to parse incoming request */
app.use(express.json());

/**connect to database */
const databaseURL: string = String(process.env.MONGO);

const connect = async () => {
  try {
    await mongoose.createConnection(databaseURL);
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

/**Error Handler */
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.status(error.status || 500)
  res.send({
    success: false,
    status: error.status || 500,
    message: error.message || "Sorry! something went wrong"
  })
}

app.use(errorHandler);

app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`)
});
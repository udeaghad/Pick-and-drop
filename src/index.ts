import express, { Request, Response, ErrorRequestHandler, Application} from "express";
import dotenv from "dotenv";
import cors from "cors";

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
  console.log(`Server is running on port ${port}`)
});
import express, { Request, Response, ErrorRequestHandler, Application} from "express";

const app: Application = express();

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

app.listen(5000, () => {
  console.log("Serve is running on port 5000")
});
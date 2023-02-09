import mongoose from "mongoose";
import app from "./app";

const port: number = Number(process.env.PORT) || 5001;

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


app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`)
});
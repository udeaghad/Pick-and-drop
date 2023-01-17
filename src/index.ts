import express from "express";

const app = express();

app.get('/api/v1/', (req, res) => {
  res.send("Hello World")
});

app.listen(5000, () => {
  console.log("Serve is running on port 5000")
});
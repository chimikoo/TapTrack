import express from "express";
import colors from "colors";
import connectDB from "./config/connectDB.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const { PORT } = process.env;
const app = express();

// CONNECT TO DATABASE
await connectDB();

// MIDDLEWARES

// ROUTES

// ERROR HANDLER
app.use(errorHandler);

// LISTEN
app.listen(PORT, () => {
  console.log(
    `Server is running on`.gray,
    `http://localhost:${PORT}`.underline.green
  );
});

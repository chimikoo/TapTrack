import express from "express";
import colors from "colors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import userRoutes from "./routes/user.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import orderRoutes from "./routes/order.routes.js";
import receiptRoutes from "./routes/receipt.routes.js";
import eodRoutes from "./routes/eod.routes.js";
import isAuth from "./middlewares/isAuth.js";
import isAdminOrManager from "./middlewares/isAdminOrManager.js";

const { PORT } = process.env;
const app = express();

// CONNECT TO DATABASE
await connectDB();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
app.use("/users", userRoutes);
app.use("/users/menu-items", isAuth, menuRoutes);
app.use("/users/menu-orders", isAuth, orderRoutes);
app.use("/users/checkout", isAuth, receiptRoutes);
app.use("/eod", isAuth, isAdminOrManager, eodRoutes);

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

// LISTEN
app.listen(PORT, () => {
  console.log(
    `Server is running on`.gray,
    `http://localhost:${PORT}`.underline.green
  );
});

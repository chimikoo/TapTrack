import asyncHandler from "../config/asyncHandler.js";
import jwt from "jsonwebtoken";

const isAuth = asyncHandler((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // add the userRole to the request object
      req.userRole = payload.userRole;
      next();
    } catch (error) {
      res
        .status(401)
        .json({ message: "You are not authorized! Token invalid" });
    }
  } else {
    res.status(401);
    throw new Error("You are not authorized! No token found!");
  }
});

export default isAuth;
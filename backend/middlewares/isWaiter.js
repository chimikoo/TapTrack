import asyncHandler from "../config/asyncHandler.js";

export const isWaiter = asyncHandler((req, res, next) => {
  if (
    req.user.role !== "user" &&
    req.user.role !== "admin" &&
    req.user.role !== "manager"
  ) {
    res.status(403);
    throw new Error("Access forbidden.");
  }
  next();
});

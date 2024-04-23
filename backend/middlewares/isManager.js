import asyncHandler from "../config/asyncHandler.js";

export const isManager = asyncHandler((req, res, next) => {
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      res.status(403);
      throw new Error("Access forbidden. You must be an admin or manager to gain access.");
    }
    next();
  });
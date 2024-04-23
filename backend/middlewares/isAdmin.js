import asyncHandler from "../config/asyncHandler.js";

const isAdmin = asyncHandler((req, res, next) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Access forbidden. You must be an admin.");
  }
  next();
});

export default isAdmin;

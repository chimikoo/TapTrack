import asyncHandler from "../config/asyncHandler.js";

const isAdminOrManager = asyncHandler((req, res, next) => {
  const { userRole } = req;
  if (userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("You are not authorized to perform this action!");
  }
  next();
});

export default isAdminOrManager;

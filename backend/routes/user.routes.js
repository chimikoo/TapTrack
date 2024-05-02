import { Router } from "express";
import {
  deleteUser,
  login,
  logout,
  register,
  updateUser,
  getTotalHoursWorked,
  forceLogoutUsers,
  timeTrack,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import {
  userValidationRules,
  validate,
} from "../middlewares/userValidation.js";
import isAdminOrManager from "../middlewares/isAdminOrManager.js";

const router = Router();

// POST /users/register
router.post("/register", isAuth, userValidationRules(), validate, register);

// POST /users/login
router.post("/login", login);

// GET /users/logout
router.get("/logout", isAuth, logout);

// PATCH /users
router.patch("/", isAuth, updateUser);

// PATCH /users/:id
router.patch("/:id", isAuth, updateUserRole);

// DELETE /users/:id
router.delete("/:id", isAuth, deleteUser);

// GET /users/total-hours-worked
router.get("/total-hours-worked", isAuth, getTotalHoursWorked);

// PUT /users/forcedLogout/
router.put("/forcedLogout", isAuth, isAdminOrManager, forceLogoutUsers);

// POST /users/timeTrack
router.post("/timeTrack", isAuth, isAdminOrManager, timeTrack);

export default router;

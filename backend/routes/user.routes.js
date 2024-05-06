import { Router } from "express";
import {
  deleteUser,
  login,
  logout,
  register,
  updateUser,
  forceLogoutUsers,
  timeTrack,
  updateUserRole,
  getUsersList,
  getUserById,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import {
  userValidationRules,
  validate,
} from "../middlewares/userValidation.js";
import isAdminOrManager from "../middlewares/isAdminOrManager.js";
import { get } from "mongoose";

const router = Router();

// POST /users/register
router.post("/register", isAuth, userValidationRules(), validate, register);

// POST /users/login
router.post("/login", login);

// GET /users/logout
router.get("/logout", isAuth, logout);

// PATCH /users
router.patch("/", isAuth, updateUser);

// GET /users
router.get("/", isAuth, getUsersList);

// GET /users/:id
router.get("/:id", isAuth, getUserById);

// PATCH /users/:id
router.patch("/:id", isAuth, updateUserRole);

// DELETE /users/:id
router.delete("/:id", isAuth, deleteUser);

// PUT /users/forcedLogout/
router.put("/forcedLogout", isAuth, isAdminOrManager, forceLogoutUsers);

// GET /users/timeTrack/:month
router.get("/timeTrack/:month", isAuth, timeTrack);

export default router;

import { Router } from "express";
import {
  deleteUser,
  login,
  logout,
  register,
  updateUser,
  getTotalHoursWorked,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import {
  userValidationRules,
  validate,
} from "../middlewares/userValidation.js";

const router = Router();

// POST /users/register
router.post("/register", isAuth, userValidationRules(), validate, register);

// POST /users/login
router.post("/login", login);

// GET /users/logout
router.get("/logout", isAuth, logout);

// PUT /users/update/:id
router.put("/update/:id", isAuth, updateUser);

// DELETE /users/delete/:id
router.delete("/delete/:id", isAuth, deleteUser);

// GET /users/total-hours-worked
router.get("/total-hours-worked", isAuth, getTotalHoursWorked);

export default router;

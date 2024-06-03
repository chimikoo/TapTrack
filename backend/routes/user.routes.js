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
  getUserByUsername,
  showAvatar,
  getTables,
  getTableByNumber,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import {
  userValidationRules,
  validate,
} from "../middlewares/userValidation.js";
import isAdminOrManager from "../middlewares/isAdminOrManager.js";
import { upload } from "../utils/storage.js";

const router = Router();

// POST /users/register
router.post("/register", isAuth, userValidationRules(), validate, register);

// POST /users/login
router.post("/login", login);

// GET /users/logout
router.get("/logout", isAuth, logout);

// PATCH /users
router.patch("/", isAuth, upload.single("avatar"), updateUser);

// GET /users
router.get("/", isAuth, getUsersList);

// GET /users/info/:username
router.get("/info/:username", isAuth, getUserByUsername);

// PATCH /users/role/:id
router.patch("/role/:id", isAuth, updateUserRole);

// DELETE /users/:id
router.delete("/:id", isAuth, deleteUser);

// PUT /users/forcedLogout/
router.put("/forcedLogout", isAuth, isAdminOrManager, forceLogoutUsers);

// GET /users/timeTrack
router.get("/timeTrack", isAuth, timeTrack);

// GET /users/:username/avatar
router.get("/:username/avatar", showAvatar);

// GET /users/tables
router.get("/tables", isAuth, getTables);

// GET /users/tables/:number
router.get("/tables/:number", isAuth, getTableByNumber);

export default router;

import { Router } from "express";
import {
  deleteUser,
  login,
  logout,
  register,
  updateUser,
  forceLogoutUsers,
  timeTrack,
  getUserTimeTrack,
  updateUserRole,
  getUsersList,
  showAvatar,
  getTables,
  getTableByNumber,
  logoutUserById,
  getUserById,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import isAdminOrManager from "../middlewares/isAdminOrManager.js";
import {
  userValidationRules,
  validate,
} from "../middlewares/userValidation.js";
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

// GET /users/info/:userId
router.get("/info/:userId", isAuth, getUserById);

// PATCH /users/role/:userId
router.patch("/role/:userId", isAuth, updateUserRole);

// DELETE /users/:userId
router.delete("/:userId", isAuth, deleteUser);

// PUT /users/forcedLogout/ (all users)
router.put("/forcedLogout", isAuth, isAdminOrManager, forceLogoutUsers);

// PUT /users/forcedLogout/:userId
router.put("/forcedLogout/:userId", isAuth, isAdminOrManager, logoutUserById);

// GET /users/timeTrack
router.get("/timeTrack", isAuth, timeTrack);

// GET /users/timeTrack/user/:userId
router.get("/timeTrack/user/:userId", isAuth, isAdminOrManager, getUserTimeTrack);

// GET /users/:username/avatar
router.get("/:username/avatar", showAvatar);

// GET /users/tables
router.get("/tables", isAuth, getTables);

// GET /users/tables/:number
router.get("/tables/:number", isAuth, getTableByNumber);

export default router;

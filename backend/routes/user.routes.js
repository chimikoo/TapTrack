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

// GET /users/info/:id
router.get("/info/:id", isAuth, getUserById);

// PATCH /users/role/:id
router.patch("/role/:id", isAuth, updateUserRole);

// DELETE /users/:id
router.delete("/:id", isAuth, deleteUser);

// PUT /users/forcedLogout/
router.put("/forcedLogout", isAuth, isAdminOrManager, forceLogoutUsers);

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

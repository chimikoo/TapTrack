import { Router } from "express";
import multer from "multer";
import fs from "fs";
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
  showAvatar,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import {
  userValidationRules,
  validate,
} from "../middlewares/userValidation.js";
import isAdminOrManager from "../middlewares/isAdminOrManager.js";
import { get } from "mongoose";

const router = Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const splitName = file.originalname.split(".");
    const ext = splitName[splitName.length - 1];
    const fileName = `${crypto.randomUUID()}.${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

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

// GET /users/timeTrack/:month
router.get("/timeTrack/:month", isAuth, timeTrack);

// GET /users/:username/avatar
router.get("/:username/avatar", isAuth, showAvatar);

export default router;

import { Router } from "express";
import { deleteUser, login, logout, register, updateUser } from "../controllers/user.controllers.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

// POST /users/register
router.post("/register", register);

// POST /users/login
router.post("/login", login);

// GET /users/logout
router.get("/logout", logout);

// PUT /users/update/:id
router.put("/update/:id", isAdmin, updateUser);

// DELETE /users/delete/:id
router.delete("/delete/:id", deleteUser);

export default router;

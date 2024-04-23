import { Router } from "express";
import {
  createBeverageItem,
  createFoodItem,
  deleteBeverageItem,
  deleteFoodItem,
  getAllBeverageItems,
  getAllFoodItems,
  getAllMenuItems,
  getOneBeverageItem,
  getOneFoodItem,
  updateBeverageExtras,
  updateBeverageItem,
  updateFoodExtras,
  updateFoodItem,
} from "../controllers/menu.controllers.js";

const router = Router();

// GET /users/menu/items
router.get("/", getAllMenuItems);

// GET /users/menu/items/foods
router.get("/foods", getAllFoodItems);

// GET /users/menu/items/beverages
router.get("/beverages", getAllBeverageItems);

// GET /users/menu/items/foods/:id
router.get("/foods/:id", getOneFoodItem);

// GET /users/menu/items/beverages/:id
router.get("/beverages/:id", getOneBeverageItem);

// POST /users/menu/items/addFood
router.post("/addFood", createFoodItem);

// POST /users/menu/items/addBeverage
router.post("/addBeverage", createBeverageItem);

// PUT /users/menu/items/updateFood/:id
router.put("/updateFood/:id", updateFoodItem);

// PUT /users/menu/items/updateBeverage/:id
router.put("/updateBeverage/:id", updateBeverageItem);

// DELETE /users/menu/items/deleteFood/:id
router.delete("/deleteFood/:id", deleteFoodItem);

// DELETE /users/menu/items/deleteBeverage/:id
router.delete("/deleteBeverage/:id", deleteBeverageItem);

// PATCH /users/menu/items/updateFoodExtras/:id
router.patch("/updateFoodExtras/:id", updateFoodExtras);

// PATCH /users/menu/items/updateBeverageExtras/:id
router.patch("/updateBeverageExtras/:id", updateBeverageExtras);

export default router;

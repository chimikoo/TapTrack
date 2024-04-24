import { Router } from "express";
import isAuth from "../middlewares/isAuth.js";

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
  updateBeverageItem,
  addExtra,
  updateFoodItem,
} from "../controllers/menu.controllers.js";

const router = Router();

// GET /users/menu-items
router.get("/", isAuth, getAllMenuItems);

// foods routes
router
  .route("/foods")
  .get(isAuth, getAllFoodItems) // GET /users/menu-items/foods
  .post(isAuth, createFoodItem); // POST /users/menu-items/foods
  
router
  .route("/foods/:id")
  .get(isAuth, getOneFoodItem) // GET /users/menu-items/foods/:id
  .put(isAuth, updateFoodItem) // PUT /users/menu-items/foods/:id
  .delete(isAuth, deleteFoodItem); // DELETE /users/menu-items/foods/:id

// beverages routes
router
  .route("/beverages")
  .get(isAuth, getAllBeverageItems) // GET /users/menu-items/beverages
  .post(isAuth, createBeverageItem); // POST /users/menu-items/beverages

router
  .route("/beverages/:id")
  .get(isAuth, getOneBeverageItem) // GET /users/menu-items/beverages/:id
  .put(isAuth, updateBeverageItem) // PUT /users/menu-items/beverages/:id
  .delete(isAuth, deleteBeverageItem); // DELETE /users/menu-items/beverages/:id


// POST /users/menu-items/extras
router.post("/extras", isAuth, addExtra);

export default router;

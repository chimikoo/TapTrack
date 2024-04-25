import asyncHandler from "../config/asyncHandler.js";
import FoodModel from "../models/food.model.js";
import BeverageModel from "../models/beverage.model.js";
import ExtraModel from "../models/extra.model.js";

/* 
@desc   Get all menu items
@route  GET /users/menu-items
@access Public
*/
const getAllMenuItems = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const foodQuery = FoodModel.find();
  const beverageQuery = BeverageModel.find();

  const foods = await foodQuery;
  const beverages = await beverageQuery;
  res
    .status(200)
    .json({ message: "All menu items", data: { foods, beverages } });
});

/* 
@desc   Get all food items
@route  GET /users/menu-items/foods
@access Public
*/
const getAllFoodItems = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  let foodQuery = FoodModel.find();
  // Filtering food items
  if (req.query.category) {
    foodQuery = foodQuery.where("category").equals(req.query.category);
  }
  if (req.query.name) {
    foodQuery = foodQuery.where("name").regex(new RegExp(req.query.name, "i"));
  }
  if (req.query.price) {
    foodQuery = foodQuery.where("price").lt(req.query.price);
  }

  const foods = await foodQuery;
  res.status(200).json({
    message: "All food items",
    numberItems: foods.length,
    data: foods,
  });
});

/* 
@desc   Get all beverage items
@route  GET /users/menu-items/beverages
@access Public
*/
const getAllBeverageItems = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  let beverageQuery = BeverageModel.find();
  // Filtering beverage items
  if (req.query.name) {
    beverageQuery = beverageQuery
      .where("name")
      .regex(new RegExp(req.query.name, "i"));
  }
  if (req.query.type) {
    beverageQuery = beverageQuery.where("type").equals(req.query.type);
  }
  if (req.query.price) {
    beverageQuery = beverageQuery
      .where("sizesPrices.price")
      .lt(req.query.price);
  }
  if (req.query.size) {
    beverageQuery = beverageQuery
      .where("sizesPrices.size")
      .equals(req.query.size);
  }
  const beverages = await beverageQuery;
  res.status(200).json({
    message: "All beverage items",
    numberItems: beverages.length,
    data: beverages,
  });
});

/* 
@desc   Get one food item
@route  GET /users/menu-items/foods/:id
@access Public
*/
const getOneFoodItem = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const food = await FoodModel.findById(req.params.id);
  if (!food) {
    res.status(404);
    throw new Error("Food item not found");
  }
  res.status(200).json({ message: "Food item", data: food });
});

/* 
@desc   Get one beverage item
@route  GET /users/menu-items/beverages/:id
@access Public
*/
const getOneBeverageItem = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const beverage = await BeverageModel.findById(req.params.id);
  if (!beverage) {
    res.status(404);
    throw new Error("Beverage item not found");
  }
  res.status(200).json({ message: "Beverage item", data: beverage });
});

/* 
@desc   Create a food item
@route  POST /users/menu-items/foods
@access Private
*/
const createFoodItem = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const { name, price, description, category } = req.body;
  const newFoodItem = await FoodModel.create({
    name,
    price,
    description,
    category,
  });
  res.status(201).json({ message: "Food item created", data: newFoodItem });
});

/* 
@desc   Create a beverage item
@route  POST /users/menu-items/beverages
@access Private
*/
const createBeverageItem = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const { name, description, category, type, sizesPrices } = req.body;
  const newBeverageItem = await BeverageModel.create({
    name,
    description,
    category,
    type,
    sizesPrices,
  });
  res
    .status(201)
    .json({ message: "Beverage item created", data: newBeverageItem });
});

/* 
@desc   Update a food item
@route  PUT /users/menu-items/foods/:id
@access Private
*/
const updateFoodItem = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const { name, price, description, category } = req.body;
  const updatedFoodItem = await FoodModel.findByIdAndUpdate(
    req.params.id,
    { name, price, description, category },
    { new: true }
  );
  res.status(200).json({ message: "Food item updated", data: updatedFoodItem });
});

/* 
@desc   Update a beverage item
@route  PUT /users/menu-items/beverages/:id
@access Private
*/
const updateBeverageItem = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const { name, description, category, type, sizesPrices } = req.body;
  const updatedBeverageItem = await BeverageModel.findByIdAndUpdate(
    req.params.id,
    { name, description, category, type, sizesPrices },
    { new: true }
  );
  res
    .status(200)
    .json({ message: "Beverage item updated", data: updatedBeverageItem });
});

/* 
@desc   Delete a food item
@route  DELETE /users/menu-items/foods/:id
@access Private
*/
const deleteFoodItem = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  await FoodModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Food item deleted" });
});

/* 
@desc   Delete a beverage item
@route  DELETE /users/menu-items/beverages/:id
@access Private
*/
const deleteBeverageItem = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  await BeverageModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Beverage item deleted" });
});

/* 
@desc   ADD extras
@route  POST /users/menu-items/extras
@access Private
*/
const addExtra = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const { extra, price } = req.body;
  const newExtra = await ExtraModel.create({ extra, price });
  res.status(201).json({ message: "Extra added", data: newExtra });
});

export {
  getAllMenuItems,
  getAllFoodItems,
  getAllBeverageItems,
  getOneFoodItem,
  getOneBeverageItem,
  createFoodItem,
  createBeverageItem,
  updateFoodItem,
  updateBeverageItem,
  deleteFoodItem,
  deleteBeverageItem,
  addExtra,
};

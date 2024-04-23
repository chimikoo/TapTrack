import asyncHandler from "../config/asyncHandler.js";
import FoodModel from "../models/food.model.js";
import BeverageModel from "../models/beverage.model.js";

/* 
@desc   Get all menu items
@route  GET /users/menu/items
@access Public
*/
const getAllMenuItems = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const foods = await FoodModel.find();
  const beverages = await BeverageModel.find();
  res
    .status(200)
    .json({ message: "All menu items", data: { foods, beverages } });
});

/* 
@desc   Get all food items
@route  GET /users/menu/items/foods
@access Public
*/
const getAllFoodItems = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const foods = await FoodModel.find();
  res.status(200).json({ message: "All food items", data: foods });
});

/* 
@desc   Get all beverage items
@route  GET /users/menu/items/beverages
@access Public
*/
const getAllBeverageItems = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const beverages = await BeverageModel.find();
  res.status(200).json({ message: "All beverage items", data: beverages });
});

/* 
@desc   Get one food item
@route  GET /users/menu/items/food/:id
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
@route  GET /users/menu/items/beverage/:id
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
@route  POST /users/menu/items/addFood
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
@route  POST /users/menu/items/addBeverage
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
@route  PUT /users/menu/items/updateFood/:id
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
@route  PUT /users/menu/items/updateBeverage/:id
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
@route  DELETE /users/menu/items/deleteFood/:id
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
@route  DELETE /users/menu/items/deleteBeverage/:id
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
@desc   Update food extras
@route  PATCH /users/menu/items/updateFoodExtras/:id
@access Private
*/
const updateFoodExtras = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const { extras } = req.body;
  const updatedFoodItem = await FoodModel.findByIdAndUpdate(
    req.params.id,
    { $push: { extras } },
    { new: true }
  );
  res.status(200).json({ message: "Food item updated", data: updatedFoodItem });
});

/* 
@desc   Update beverage extras
@route  PATCH /users/menu/items/updateBeverageExtras/:id
@access Private
*/
const updateBeverageExtras = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const { extras } = req.body;
  const updatedBeverageItem = await BeverageModel.findByIdAndUpdate(
    req.params.id,
    { $push: { extras } },
    { new: true }
  );
  res
    .status(200)
    .json({ message: "Beverage item updated", data: updatedBeverageItem });
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
  updateFoodExtras,
  updateBeverageExtras,
};

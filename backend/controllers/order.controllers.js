import asyncHandler from "../config/asyncHandler.js";
import Order from "../models/order.model.js";

/* 
@desc   Add an order
@route  POST /users/menu/order
@access Private
*/
const addOrder = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const userId = req.userId;
  const { tableNumber, drinks, starter, main, side, dessert, extras } =
    req.body;
  const newOrder = await Order.create({
    userId,
    tableNumber,
    drinks,
    starter,
    main,
    side,
    dessert,
    extras,
  });
  res
    .status(201)
    .json({ message: "Order created successfully", data: newOrder });
});

/* 
@desc   Get all orders
@route  GET /users/menu-orders
@access Private
*/
const getAllOrders = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const orders = await Order.find().populate([
    "userId",
    "starter.dishItem",
    "main.dishItem",
    "side.dishItem",
    "dessert.dishItem",
    "drinks",
    "extras",
  ]);
  if (orders.length === 0 || !orders) {
    res.status(404);
    throw new Error("No orders found");
  }
  res.status(200).json({ message: "All orders", data: orders });
});

/* 
@desc   Get an order by ID
@route  GET /users/menu-orders/:id
@access Private
*/
const getOrderById = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const order = await Order.findById(req.params.id).populate([
    "userId",
    "starter.dishItem",
    "main.dishItem",
    "side.dishItem",
    "dessert.dishItem",
    "drinks",
    "extras",
  ]);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.status(200).json({ message: "Order found", data: order });
});

/* 
@desc   Update an order
@route  PUT /users/menu-orders/:id
@access Private
*/
const updateOrder = asyncHandler(async (req, res) => {});

/* 
@desc   Delete an order
@route  DELETE /users/menu-orders/:id
@access Private
*/
const deleteOrder = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const order = await Order.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Order deleted successfully" });
});

export { addOrder, getAllOrders, getOrderById, updateOrder, deleteOrder };

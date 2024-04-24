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
  const { tableNumber, drinks, starter, main, side, desert, extras } = req.body;
  const newOrder = await Order.create({
    userId,
    tableNumber,
    drinks,
    starter,
    main,
    side,
    desert,
    extras,
  });
  res
    .status(201)
    .json({ message: "Order created successfully", data: newOrder });
});

/* 
@desc   Get all orders
@route  GET /users/menu/order
@access Private
*/
const getAllOrders = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const orders = await Order.find().populate("user");
  res.status(200).json({ message: "All orders", data: orders });
});

export { addOrder, getAllOrders };

import asyncHandler from "../config/asyncHandler.js";
import Order from "../models/order.model.js";
import Table from "../models/table.model.js";
import updateStockAfterOrder from "../utils/updateStockAfterOrder.js";

/* 
@desc   Add an order
@route  POST /users/menu/order
@access Private
*/
const addOrder = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { tableNumber, drinks, starter, main, side, dessert, extras } =
    req.body;
  if (!tableNumber || !drinks || !starter || !main || !side || !dessert) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Check if the table exists
  let existingTable = await Table.findOne({ tableNumber });
  if (!existingTable) {
    // If the table doesn't exist, create a new one
    existingTable = await Table.create({
      userId,
      tableNumber,
      state: "occupied",
    });
  } else if (existingTable.state === "available") {
    // If the table is available, update the state to occupied
    existingTable.state = "occupied";
    await existingTable.save();
  } else {
    res.status(400);
    throw new Error("Table is already occupied/reserved");
  }

  // Remove quantity ordered from stock
  try {
    await updateStockAfterOrder(drinks, "beverage");
    await updateStockAfterOrder(starter, "food");
    await updateStockAfterOrder(main, "food");
    await updateStockAfterOrder(side, "food");
    await updateStockAfterOrder(dessert, "food");
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }

  // Create the order
  const newOrder = await Order.create({
    userId,
    tableNumber: existingTable._id,
    drinks,
    starter,
    main,
    side,
    dessert,
    extras,
  });

  // Assign the orderId to the table
  existingTable.orderId = newOrder._id;
  await existingTable.save();

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
  let ordersQuery = Order.find();
  // filter orders by table
  if (req.query.tableNumber) {
    ordersQuery = Order.find({ tableNumber: req.query.tableNumber });
  }
  const orders = await ordersQuery.populate([
    "userId",
    "starter.dishItem",
    "main.dishItem",
    "side.dishItem",
    "dessert.dishItem",
    "drinks.drinkItem",
    "extras",
  ]);
  if (orders.length === 0 || !orders) {
    res.status(404);
    throw new Error("No orders found");
  }
  res.status(200).json({
    message: "All orders",
    numberOfOrders: orders.length,
    data: orders,
  });
});

/* 
@desc   Get an order by ID
@route  GET /users/menu-orders/:id
@access Private
*/
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate([
    "userId",
    "starter.dishItem",
    "main.dishItem",
    "side.dishItem",
    "dessert.dishItem",
    "drinks.drinkItem",
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
const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.status(200).json({ message: "Order updated successfully", data: order });
});

/* 
@desc   Delete an order
@route  DELETE /users/menu-orders/:id
@access Private
*/
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.status(200).json({ message: "Order deleted successfully" });
});

export { addOrder, getAllOrders, getOrderById, updateOrder, deleteOrder };

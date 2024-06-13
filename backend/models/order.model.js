import { Schema, model } from "mongoose";

// Sub-schemas for nested objects
const extraSchema = new Schema(
  {
    extra: String,
    price: Number,
  },
  { _id: false }
);

const starterSchema = new Schema(
  {
    quantity: { type: Number, required: true },
    dishItem: { type: Schema.Types.ObjectId, ref: "food" },
    extras: [extraSchema],
  },
  { _id: false }
);

const mainSchema = new Schema(
  {
    quantity: { type: Number, required: true },
    dishItem: { type: Schema.Types.ObjectId, ref: "food" },
    extras: [extraSchema],
  },
  { _id: false }
);

const sideSchema = new Schema(
  {
    quantity: { type: Number, required: true },
    dishItem: { type: Schema.Types.ObjectId, ref: "food" },
    extras: [extraSchema],
  },
  { _id: false }
);

const dessertSchema = new Schema(
  {
    quantity: { type: Number, required: true },
    dishItem: { type: Schema.Types.ObjectId, ref: "food" },
    extras: [extraSchema],
  },
  { _id: false }
);

const drinkSchema = new Schema(
  {
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    drinkItem: { type: Schema.Types.ObjectId, ref: "beverage" },
    extras: [extraSchema],
  },
  { _id: false }
);

// Define the main schema for the order
const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  tableNumber: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  drinks: [drinkSchema],
  starter: [starterSchema],
  main: [mainSchema],
  side: [sideSchema],
  dessert: [dessertSchema],
  isCheckout: { type: Boolean, default: false },
});

// Create and export the Mongoose model
const Order = model("order", orderSchema);

export default Order;

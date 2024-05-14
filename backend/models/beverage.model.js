import { Schema, model } from "mongoose";

const sizePriceSchema = new Schema(
  {
    size: {
      type: String,
      enum: ["small", "medium", "large"],
    },
    price: Number,
  },
  { _id: false }
);

const beverageModelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: "beverage",
  },
  type: {
    type: String,
    required: true,
    enum: ["wine", "spirits", "beer", "soda"],
  },
  stock: {
    type: Number,
    default: 0,
  },
  sizesPrices: [sizePriceSchema],
});

const BeverageModel = model("beverage", beverageModelSchema);

export default BeverageModel;

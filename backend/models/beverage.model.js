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

// ** This is what a post man request would look like for example **
// {
//  "name": "Example Drink",
//  "description": "This is an example drink",
//  "category": "beverage",
//  "type": "Wine",
//  "extras": ["Extra 1", "Extra 2"],
//  "sizesPrices": [
//    {"size": "Small", "price": 5.99},
//    {"size": "Large", "price": 8.99}
//  ]
//}

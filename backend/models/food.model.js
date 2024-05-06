import { Schema, model } from "mongoose";

const foodModelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ["starter", "main", "side", "dessert"]
  },
  stock: { 
    type: Number,
    default: 0 
  },
});

const FoodModel = model("food", foodModelSchema);

export default FoodModel;

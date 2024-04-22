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
    required: true 
  },
  extra: { 
    type: [String], 
    default: [] 
  },
});

const FoodModel = model("menuItem", foodModelSchema);

export default FoodModel;

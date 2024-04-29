import BeverageModel from "../models/beverage.model.js";
import FoodModel from "../models/food.model.js";

const updateStockAfterOrder = async (items, type) => {
  if (items.length === 0) return;
  if (type === "beverage") {
    items.forEach(async (item) => {
      const beverage = await BeverageModel.findById(item.drinkItem);
      beverage.stock -= item.quantity;
      await beverage.save();
    });
  } else {
    items.forEach(async (item) => {
      const food = await FoodModel.findById(item.dishItem);
      food.stock -= item.quantity;
      await food.save();
    });
  }
};

export default updateStockAfterOrder;

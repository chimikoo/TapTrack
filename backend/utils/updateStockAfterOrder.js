import BeverageModel from "../models/beverage.model.js";
import FoodModel from "../models/food.model.js";

const updateStockAfterOrder = async (items, type) => {
  if (items.length === 0) return;

  const updatePromises = items.map(async (item) => {
    if (type === "beverage") {
      const beverage = await BeverageModel.findById(item.drinkItem);
      if (beverage.stock < item.quantity) {
        throw new Error(
          `There is not enough stock for the beverage. ${beverage.name} has ${beverage.stock} left.`
        );
      }
      beverage.stock -= item.quantity;
      await beverage.save();
    } else {
      const food = await FoodModel.findById(item.dishItem);
      if (food.stock < item.quantity) {
        throw new Error(
          `There is not enough stock for the food. ${food.name} has ${food.stock} left.`
        );
      }
      food.stock -= item.quantity;
      await food.save();
    }
  });

  await Promise.all(updatePromises); // Ensure all updates are completed
};

export default updateStockAfterOrder;

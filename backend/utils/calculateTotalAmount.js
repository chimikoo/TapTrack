import ExtraModel from "../models/extra.model.js";
import Order from "../models/order.model.js";

const calculateTotalAmount = async (order) => {
  try {
    // Calculate the subtotal for each food item (starter, main, side, dessert)
    const calculateFoodSubtotal = (foodItem) => {
      return foodItem.quantity * foodItem.dishItem.price;
    };
    // Calculate the subtotal for each beverage
    const calculateBeverageSubtotal = (beverage) => {
      // find the sizePrice object that matches the size of the beverage ordered
      const sizePrice = beverage.drinkItem.sizesPrices.find(
        (sizePrice) => sizePrice.size === beverage.size
      );
      if (!sizePrice) {
        throw new Error("Size price not found");
      }
      return beverage.quantity * sizePrice.price;
    };
    // Calculate the subtotal for all food items and beverages
    const foodSubtotals = order.starter
      .concat(order.main, order.side, order.dessert)
      .map((foodItem) => calculateFoodSubtotal(foodItem));
    const beverageSubtotals = order.drinks.map((beverage) =>
      calculateBeverageSubtotal(beverage)
    );
    // Calculate the total amount for all the extras
    const extrasIds = order.extras;
    const extras = await ExtraModel.find({ _id: { $in: extrasIds } });
    const extrasSubtotal = extras.reduce((acc, extra) => acc + extra.price, 0);
    
    // Calculate the total amount by summing up all subtotals
    const totalAmount =
      foodSubtotals.reduce((acc, curr) => acc + curr, 0) +
      beverageSubtotals.reduce((acc, curr) => acc + curr, 0) +
      extrasSubtotal;

    return totalAmount;
  } catch (error) {
    console.log(error);
  }
};

export default calculateTotalAmount;

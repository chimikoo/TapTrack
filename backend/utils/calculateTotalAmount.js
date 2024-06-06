import ExtraModel from "../models/extra.model.js";
import Order from "../models/order.model.js";

const calculateTotalAmount = async (order) => {
  try {
    // Calculate the subtotal for each food item (starter, main, side, dessert)
    const calculateFoodSubtotal = (foodItem) => {
      return (
        foodItem.quantity * foodItem.dishItem.price +
        foodItem.extras.reduce((acc, curr) => acc + curr.price, 0) *
          foodItem.quantity
      );
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
      return (
        beverage.quantity * sizePrice.price +
        beverage.extras.reduce((acc, curr) => acc + curr.price, 0) *
          beverage.quantity
      );
    };
    // Calculate the subtotal for all food items and beverages
    const foodSubtotals = order.starter
      .concat(order.main, order.side, order.dessert)
      .map((foodItem) => calculateFoodSubtotal(foodItem));
    const beverageSubtotals = order.drinks.map((beverage) =>
      calculateBeverageSubtotal(beverage)
    );

    // Calculate the total amount by summing up all subtotals
    const totalAmount =
      foodSubtotals.reduce((acc, curr) => acc + curr, 0) +
      beverageSubtotals.reduce((acc, curr) => acc + curr, 0);

    return totalAmount;
  } catch (error) {
    console.log(error);
  }
};

export default calculateTotalAmount;

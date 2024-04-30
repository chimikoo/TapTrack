const extractItemsFromOrder = (order) => {
  const items = [];

  // Helper function to add an item to the items array
  const addItem = (item, quantity, category, size) => {
    items.push({
      itemName: item.name,
      quantity: quantity,
      price: size
        ? item.sizesPrices.find((sizePrice) => sizePrice.size === size).price
        : item.price,
      category: category,
    });
  };

  // Add each item from the order to the items array
  order.drinks.forEach((drink) =>
    addItem(drink.drinkItem, drink.quantity, "beverage", drink.size)
  );
  order.starter.forEach((starter) =>
    addItem(starter.dishItem, starter.quantity, "starter")
  );
  order.main.forEach((main) => addItem(main.dishItem, main.quantity, "main"));
  order.side.forEach((side) => addItem(side.dishItem, side.quantity, "side"));
  order.dessert.forEach((dessert) =>
    addItem(dessert.dishItem, dessert.quantity, "dessert")
  );

  return items;
};

export default extractItemsFromOrder;

const extractItemsFromOrder = (order) => {
  const items = [];

  // Helper function to add an item to the items array
  const addItem = (item, quantity, category, size, extras) => {
    const extrasArray = extras.map((ext) => ({
      extraName: ext.extra,
      extraPrice: ext.price,
    }));
    items.push({
      itemName: item.name,
      quantity: quantity,
      price: size
        ? item.sizesPrices.find((sizePrice) => sizePrice.size === size).price
        : item.price,
      category: category,
      extras: extrasArray,
    });
  };

  // Add each item from the order to the items array
  order.drinks.forEach((drink) =>
    addItem(
      drink.drinkItem,
      drink.quantity,
      "beverage",
      drink.size,
      drink.extras
    )
  );
  order.starter.forEach((starter) =>
    addItem(starter.dishItem, starter.quantity, "starter", null, starter.extras)
  );
  order.main.forEach((main) =>
    addItem(main.dishItem, main.quantity, "main", null, main.extras)
  );
  order.side.forEach((side) =>
    addItem(side.dishItem, side.quantity, "side", null, side.extras)
  );
  order.dessert.forEach((dessert) =>
    addItem(dessert.dishItem, dessert.quantity, "dessert", null, dessert.extras)
  );

  return items;
};

export default extractItemsFromOrder;

const generateEodVariables = (receipts) => {
  // Initialize variables to calculate EoD report
  let totalRevenue = 0;
  let cashRevenue = 0;
  let cardRevenue = 0;
  let totalOrders = 0;
  let totalLoss = 0;
  let totalOrdersNotPaid = 0;
  let totalFoodItems = 0;
  let totalBeverageItems = 0;
  const itemsSoldMap = new Map();

  // Iterate over each receipt to calculate EoD Orders, Revenue, Loss, etc.
  receipts.forEach((receipt) => {
    totalOrders++;
    if (!receipt.isPaid) {
      totalLoss += receipt.totalAmount;
      totalOrdersNotPaid++;
    } else {
      totalRevenue += receipt.totalAmount;
    }
    if (receipt.paymentMethod === "Cash" && receipt.isPaid) {
      cashRevenue += receipt.totalAmount;
    } else if (receipt.paymentMethod === "Credit card" && receipt.isPaid) {
      cardRevenue += receipt.totalAmount;
    }

    // Iterate over each item in the receipt to update items sold map
    receipt.items.forEach((item) => {
      updateItemsSoldMap(itemsSoldMap, item);
      // count total food and beverage items sold
      if (item.category === "beverage") {
        totalBeverageItems++;
      } else {
        totalFoodItems++;
      }
    });
  });

  // Convert itemsSoldMap to array of objects
  const itemsSold = [...itemsSoldMap.entries()].map(([itemName, quantity]) => ({
    itemName,
    quantity,
  }));

  return {
    totalOrders,
    totalFoodItems,
    totalBeverageItems,
    totalLoss,
    totalOrdersNotPaid,
    itemsSold,
    cashRevenue,
    cardRevenue,
    totalRevenue,
  };
};

// Helper function to update itemsSoldMap
function updateItemsSoldMap(itemsSoldMap, item) {
  const { itemName, quantity } = item;
  if (itemsSoldMap.has(itemName)) {
    itemsSoldMap.set(itemName, itemsSoldMap.get(itemName) + quantity);
  } else {
    itemsSoldMap.set(itemName, quantity);
  }
}

export default generateEodVariables;

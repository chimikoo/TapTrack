const incrementQuantity = (tableNumber, itemId, size, extras, setOrderItems) => {
  setOrderItems((prevOrderItems) => {
    return prevOrderItems.map((order) => {
      if (order.tableNumber !== tableNumber) return order;
      return {
        ...order,
        items: order.items.map((item) => {
          if (item._id !== itemId) return item;
          const extrasMatch =
            (!item.extras && !extras) ||
            (item.extras &&
              extras &&
              item.extras.length === extras.length &&
              item.extras.every((val, index) => val === extras[index]));

          if (extrasMatch) {
            if (item.category === "beverage" && item.size === size) {
              return { ...item, quantity: item.quantity + 1 };
            }
            if (item.category !== "beverage") {
              return { ...item, quantity: item.quantity + 1 };
            }
          }
          return item;
        }),
      };
    });
  });
};

const decrementQuantity = (tableNumber, itemId, size, extras, setOrderItems) => {
  setOrderItems((prevOrderItems) => {
    return prevOrderItems.map((order) => {
      if (order.tableNumber !== tableNumber) return order;
      return {
        ...order,
        items: order.items.reduce((acc, item) => {
          if (item._id !== itemId) {
            acc.push(item);
          } else {
            const extrasMatch =
              (!item.extras && !extras) ||
              (item.extras &&
                extras &&
                item.extras.length === extras.length &&
                item.extras.every((val, index) => val === extras[index]));

            if (extrasMatch) {
              if (item.category === "beverage" && item.size === size) {
                if (item.quantity > 1) {
                  acc.push({ ...item, quantity: item.quantity - 1 });
                }
              } else if (item.category !== "beverage") {
                if (item.quantity > 1) {
                  acc.push({ ...item, quantity: item.quantity - 1 });
                }
              }
            } else {
              acc.push(item);
            }
          }
          return acc;
        }, []),
      };
    });
  });
};

export { incrementQuantity, decrementQuantity };

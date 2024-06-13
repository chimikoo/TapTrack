import React, { createContext, useState, useContext } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([]);

  const addItemToOrder = (tableNumber, item) => {
    setOrderItems((prevOrders) => {
      const orderIndex = prevOrders.findIndex(
        (order) => order.tableNumber === tableNumber
      );

      if (orderIndex !== -1) {
        // Table already exists in order, update the items
        const updatedItems = [...prevOrders[orderIndex].items, item];
        const updatedOrders = [...prevOrders];
        updatedOrders[orderIndex] = {
          ...prevOrders[orderIndex],
          items: updatedItems,
        };
        return updatedOrders;
      } else {
        // Table doesn't exist in order, add new table with item
        return [...prevOrders, { tableNumber, items: [item] }];
      }
    });
  };

  return (
    <OrderContext.Provider
      value={{ orderItems, setOrderItems, addItemToOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);

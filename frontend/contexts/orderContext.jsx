import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([]);

  const addItemToOrder = (item) => {
    setOrderItems((prevItems) => [...prevItems, item]);
  };

  return (
    <OrderContext.Provider value={{ orderItems, addItemToOrder, setOrderItems }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);

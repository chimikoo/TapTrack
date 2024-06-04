// contexts/menuContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { TAP_TRACK_URL } from "@env";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState({ foods: [], beverages: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const [foodsResponse, beveragesResponse] = await Promise.all([
          axios.get(`${TAP_TRACK_URL}/users/menu-items/foods`),
          axios.get(`${TAP_TRACK_URL}/users/menu-items/beverages`),
        ]);
        setMenuItems({
          foods: foodsResponse.data.data,
          beverages: beveragesResponse.data.data,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <MenuContext.Provider value={{ menuItems, loading }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
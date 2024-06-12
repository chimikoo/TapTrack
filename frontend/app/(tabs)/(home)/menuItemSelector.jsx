// app/(tabs)/(home)/menuItemSelector.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AddRemove from "../../../components/AddRemove.jsx";
import Filters from "../../../components/Filters.jsx";
import CustomButton from "../../../components/CustomButton";
import { useOrder } from "../../../contexts/orderContext";
import { useMenu } from "../../../contexts/menuContext"; // Import the custom hook
import { useTheme } from "../../../contexts/themeContext.jsx";

const MenuItemSelector = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [limit, setLimit] = useState("");
  const [quantities, setQuantities] = useState([]);
  const [category, setCategory] = useState(""); // Add category state
  const { addItemToOrder } = useOrder();
  const router = useRouter();
  const params = useLocalSearchParams();

  const { menuItems, loading } = useMenu(); // Use the custom hook to access menu items
  const [menuSelected, setMenuSelected] = useState(null);
  const { theme, bgColor, textColor } = useTheme();

  useEffect(() => {
    // Ensure category is set from params if available
    if (params.category) {
      setCategory(params.category);
    }
  }, [params.category]);

  useEffect(() => {
    if (category) {
      const items =
        category === "beverage"
          ? menuItems.beverages
          : menuItems.foods.filter((item) => item.category === category);
      const newQuantities = items.flatMap((item) =>
        item.sizesPrices ? item.sizesPrices.map(() => 0) : [0]
      );
      setQuantities(newQuantities);
    }
  }, [category, menuItems]);

  const handleFilter = () => {
    let filteredMenu = menuItems.foods.concat(menuItems.beverages);
    if (name) {
      // filter menu items by name not caring if it is upper or lower case
      filteredMenu = filteredMenu.filter((item) =>
        item.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (price) {
      filteredMenu = filteredMenu.filter((item) => item.price <= price);
    }
    if (category) {
      filteredMenu = filteredMenu.filter((item) => item.category === category);
    }
    if (sortBy) {
      filteredMenu.sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "price") {
          return a.price - b.price;
        } else {
          return a.category.localeCompare(b.category);
        }
      });
    }
    if (limit) {
      filteredMenu = filteredMenu.slice(0, limit);
    }
    setMenuSelected(filteredMenu);
    // Reset filters
    setName("");
    setPrice("");
    setLimit("");
  };

  const incrementQuantity = (index) => {
    const newQuantities = [...quantities];
    newQuantities[index] += 1;
    setQuantities(newQuantities);
  };

  const decrementQuantity = (index) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 0) {
      newQuantities[index] -= 1;
    }
    setQuantities(newQuantities);
  };

  const handleAddToOrder = () => {
    const items =
      category === "beverage"
        ? menuItems.beverages
        : menuItems.foods.filter((item) => item.category === category);
    items.forEach((item, index) => {
      if (category === "beverage" && item.sizesPrices) {
        item.sizesPrices.forEach((sp, spIndex) => {
          const idx = index * item.sizesPrices.length + spIndex;
          if (quantities[idx] > 0) {
            addItemToOrder(params.tableNumber, {
              ...item,
              quantity: quantities[idx],
              price: sp.price,
              size: sp.size,
            });
          }
        });
        return;
      }
      if (quantities[index] > 0) {
        addItemToOrder(params.tableNumber, {
          ...item,
          quantity: quantities[index],
        });
      }
    });
    router.push({
      pathname: "/(tabs)/(home)/order",
      params: { tableNumber: params.tableNumber },
    });
  };

  return (
    <SafeAreaView className={`flex-1 p-4 ${bgColor}`}>
      <Filters
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
        category={category} // Pass category
        setCategory={setCategory} // Pass setCategory
        sortBy={sortBy}
        setSortBy={setSortBy}
        limit={limit}
        setLimit={setLimit}
        handleFilter={handleFilter}
      />
      <ScrollView className="flex-1">
        {loading ? (
          <ActivityIndicator size="large" color="#7CA982" />
        ) : (
          (menuSelected
            ? menuSelected
            : category === "beverage"
            ? menuItems.beverages
            : menuItems.foods.filter((item) => item.category === category)
          ).map((item, index) => {
            // add this style to an item if it is out of stock
            const outOfStockStyle =
              item.stock === 0 ? "opacity-50 line-through" : "";
            return (
              <View
                key={item._id}
                className="flex flex-col mb-2 border-b border-gray-300 pb-2"
              >
                <TouchableOpacity
                  onPress={() =>
                    item.stock > 0 &&
                    router.push({
                      pathname: "foodDetail",
                      params: {
                        id: item._id,
                        category: item.category,
                        tableNumber: params.tableNumber,
                      },
                    })
                  }
                >
                  <Text
                    className={`w-full font-bold text-md ${textColor} ${outOfStockStyle}`}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
                {category === "beverage" && item.sizesPrices ? (
                  item.sizesPrices.map((sp, spIndex) => {
                    const idx = index * item.sizesPrices.length + spIndex;
                    return (
                      <View
                        key={`${item._id}-${spIndex}`}
                        className="flex flex-row justify-between items-center mt-2"
                      >
                        <Text
                          className={`w-[20%] ${textColor} ${outOfStockStyle}`}
                        >
                          {sp.size}
                        </Text>
                        <Text
                          className={`w-[20%] ${textColor} ${outOfStockStyle}`}
                        >
                          {sp.price}€
                        </Text>
                        {item.stock > 0 && (
                          <AddRemove
                            quantity={quantities[idx]}
                            handleDecrement={() => decrementQuantity(idx)}
                            handleIncrement={() => incrementQuantity(idx)}
                          />
                        )}
                      </View>
                    );
                  })
                ) : (
                  <View className="flex flex-row justify-between items-center">
                    <Text
                      className={`w-[30%] pl-5 ${textColor} ${outOfStockStyle}`}
                    >
                      {item.price}€
                    </Text>
                    {item.stock > 0 && (
                      <AddRemove
                        quantity={quantities[index]}
                        handleDecrement={() => decrementQuantity(index)}
                        handleIncrement={() => incrementQuantity(index)}
                      />
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
      <View className="w-full flex items-center mt-4">
        <CustomButton
          text="Add to Order"
          containerStyles="w-full"
          handlePress={handleAddToOrder}
        />
      </View>
    </SafeAreaView>
  );
};

export default MenuItemSelector;

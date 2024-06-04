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

  useEffect(() => {
    // Ensure category is set from params if available
    if (params.category) {
      setCategory(params.category);
    }
  }, [params.category]);

  useEffect(() => {
    if (category) {
      const items = category === "beverage" 
        ? menuItems.beverages 
        : menuItems.foods.filter(item => item.category === category);
      const newQuantities = items.flatMap(item =>
        item.sizesPrices ? item.sizesPrices.map(() => 0) : [0]
      );
      setQuantities(newQuantities);
    }
  }, [category, menuItems]);

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
    const items = category === "beverage" 
      ? menuItems.beverages 
      : menuItems.foods.filter(item => item.category === category);
    items.forEach((item, index) => {
      if (category === "beverage" && item.sizesPrices) {
        item.sizesPrices.forEach((sp, spIndex) => {
          const idx = index * item.sizesPrices.length + spIndex;
          if (quantities[idx] > 0) {
            addItemToOrder({
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
        addItemToOrder({ ...item, quantity: quantities[index] });
      }
    });
    router.push({
      pathname: "/(tabs)/(home)/order",
      params: { tableNumber: params.tableNumber },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter p-4">
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
      />
      <ScrollView className="flex-1">
        {loading ? (
          <ActivityIndicator size="large" color="#7CA982" />
        ) : (
          (category === "beverage" 
            ? menuItems.beverages 
            : menuItems.foods.filter(item => item.category === category)).map((item, index) => (
            <View
              key={item._id}
              className="flex flex-col mb-2 border-b border-gray-300 pb-2"
            >
              <TouchableOpacity
                onPress={() =>
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
                <Text className="w-full font-bold text-md">{item.name}</Text>
              </TouchableOpacity>
              {category === "beverage" && item.sizesPrices ? (
                item.sizesPrices.map((sp, spIndex) => {
                  const idx = index * item.sizesPrices.length + spIndex;
                  return (
                    <View
                      key={`${item._id}-${spIndex}`}
                      className="flex flex-row justify-between items-center mt-2"
                    >
                      <Text className="w-[20%]">{sp.size}</Text>
                      <Text className="w-[20%]">{sp.price}€</Text>
                      <AddRemove
                        quantity={quantities[idx]}
                        handleDecrement={() => decrementQuantity(idx)}
                        handleIncrement={() => incrementQuantity(idx)}
                      />
                    </View>
                  );
                })
              ) : (
                <View className="flex flex-row justify-between items-center">
                  <Text className="w-[30%] pl-5">{item.price}€</Text>
                  <AddRemove
                    quantity={quantities[index]}
                    handleDecrement={() => decrementQuantity(index)}
                    handleIncrement={() => incrementQuantity(index)}
                  />
                </View>
              )}
            </View>
          ))
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

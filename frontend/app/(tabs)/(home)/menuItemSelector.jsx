import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../../../components/CustomButton";
import axios from "axios";
import { useRouter } from "expo-router";
import AddRemove from "../../../components/AddRemove.jsx";
import Filters from "../../../components/Filters.jsx";

const MenuItemSelector = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [limit, setLimit] = useState("");
  const [quantities, setQuantities] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchMenuItems = async (category) => {
    setLoading(true);
    try {
      let response;
      if (category === "beverage") {
        response = await axios.get(
          "https://sour-turtle-53.loca.lt/users/menu-items/beverages",
          {
            params: {
              name,
              price,
              sort: sortBy,
              limit,
            },
          }
        );
      } else {
        response = await axios.get(
          "https://sour-turtle-53.loca.lt/users/menu-items/foods",
          {
            params: {
              category,
              name,
              price,
              sort: sortBy,
              limit,
            },
          }
        );
      }
      setMenuItems(response.data.data);
      setQuantities(Array(response.data.data.length).fill(0));
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch starters on initial render
  useEffect(() => {
    fetchMenuItems("starter");
  }, []);

  // Fetch menu items when filters change
  useEffect(() => {
    if (category) {
      fetchMenuItems(category);
    }
  }, [category, name, price, sortBy, limit]);

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

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter p-4">
      <Filters
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        limit={limit}
        setLimit={setLimit}
      />
      <ScrollView className="flex-1">
        {loading ? (
          <ActivityIndicator size="large" color="#7CA982" />
        ) : (
          menuItems.map((item, index) => (
            <TouchableOpacity
              key={item._id}
              className="flex flex-col mb-2 border-b border-gray-300 pb-2"
              onPress={() =>
                router.push({
                  pathname: "foodDetail",
                  params: { id: item._id, category: item.category },
                })
              }
            >
              <Text className="w-full font-bold text-md">{item.name}</Text>
              {category === "beverage" && item.sizesPrices ? (
                item.sizesPrices.map((sp, spIndex) => (
                  <View
                    key={spIndex}
                    className="flex flex-row justify-between items-center mt-2"
                  >
                    <Text className="w-[20%]">{sp.size}</Text>
                    <Text className="w-[20%]">{sp.price}€</Text>
                    <AddRemove
                      quantity={quantities[spIndex]}
                      handleDecrement={() => decrementQuantity(spIndex)}
                      handleIncrement={() => incrementQuantity(spIndex)}
                    />
                  </View>
                ))
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
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <View className="w-full flex items-center mt-4">
        <CustomButton
          text="Add to Order"
          containerStyles="w-full"
          handlePress={() => {
            // Add selected items to order
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MenuItemSelector;

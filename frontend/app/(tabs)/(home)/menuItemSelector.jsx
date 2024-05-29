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
          "https://empty-frog-47.loca.lt/users/menu-items/beverages",
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
          "https://empty-frog-47.loca.lt/users/menu-items/foods",
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
      <View className="flex flex-row justify-between items-center mb-4">
        <TouchableOpacity>
          <Text className="text-2xl">{"HEADER REMOVE LATER"}</Text>
        </TouchableOpacity>
      </View>
      <View className="flex flex-row justify-between items-center mb-4 space-x-2">
        <TextInput
          className="w-[30%] h-10 px-2 border bg-[#F5F5F5] border-gray-300 rounded"
          placeholder="name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="w-[30%] h-10 px-2 border bg-[#F5F5F5] border-gray-300 rounded"
          placeholder="price"
          value={price}
          onChangeText={setPrice}
        />
        <View className="w-[30%] h-10 bg-[#F5F5F5] rounded-lg border border-gray-300 justify-center">
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            className="w-full h-full"
          >
            <Picker.Item label="Select category" value="" />
            <Picker.Item label="Starters" value="starter" />
            <Picker.Item label="Drinks" value="beverage" />
            <Picker.Item label="Main" value="main" />
            <Picker.Item label="Side" value="side" />
            <Picker.Item label="Dessert" value="dessert" />
          </Picker>
        </View>
      </View>
      <View className="flex flex-row justify-between items-center mb-4 space-x-2">
        <View className="w-[30%] h-10 bg-[#F5F5F5] rounded-lg border border-gray-300 justify-center">
          <Picker
            selectedValue={sortBy}
            onValueChange={(itemValue) => setSortBy(itemValue)}
            className="w-full h-full"
          >
            <Picker.Item label="Sort by" value="" />
            <Picker.Item label="Name" value="name" />
            <Picker.Item label="Price" value="price" />
            <Picker.Item label="Category" value="category" />
          </Picker>
        </View>
        <TextInput
          className="w-[30%] h-10 bg-[#F5F5F5] px-2 border border-gray-300 rounded"
          placeholder="limit"
          value={limit}
          onChangeText={setLimit}
        />
        <CustomButton
          text="Filter"
          containerStyles="w-[30%] h-10 ml-2"
          handlePress={() => {
            /* Implement filter logic */
          }}
        />
      </View>
      <ScrollView className="flex-1">
        {loading ? (
          <ActivityIndicator size="large" color="#7CA982" />
        ) : (
          menuItems.map((item, index) => (
            <View
              key={item._id}
              className="flex flex-col mb-2 border-b border-gray-300 pb-2"
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
                    <View className="w-[30%] flex flex-row justify-between items-center">
                      <TouchableOpacity
                        className="w-8 h-8 flex justify-center items-center bg-primary-dark rounded"
                        onPress={() => decrementQuantity(index)}
                      >
                        <Text className="text-xl text-white">-</Text>
                      </TouchableOpacity>
                      <Text className="mx-2">{quantities[index]}</Text>
                      <TouchableOpacity
                        className="w-8 h-8 flex justify-center items-center bg-primary-dark rounded"
                        onPress={() => incrementQuantity(index)}
                      >
                        <Text className="text-xl text-white">+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View className="flex flex-row justify-between items-center">
                  <Text className="w-[30%] pl-5">{item.price}€</Text>
                  <View className="w-[30%] flex flex-row justify-between items-center">
                    <TouchableOpacity
                      className="w-8 h-8 flex justify-center items-center bg-primary-dark rounded"
                      onPress={() => decrementQuantity(index)}
                    >
                      <Text className="text-xl text-white">-</Text>
                    </TouchableOpacity>
                    <Text className="mx-2">{quantities[index]}</Text>
                    <TouchableOpacity
                      className="w-8 h-8 flex justify-center items-center bg-primary-dark rounded"
                      onPress={() => incrementQuantity(index)}
                    >
                      <Text className="text-xl text-white">+</Text>
                    </TouchableOpacity>
                  </View>
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
          handlePress={() => {
            router.push("foodDetail");
          }}
        />
      </View>
      <View className="flex flex-row justify-between items-center mb-4">
        <TouchableOpacity>
          <Text className="text-2xl">{"FOOTER REMOVE LATER"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MenuItemSelector;

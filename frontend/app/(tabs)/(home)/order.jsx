import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton";
import { useRouter } from "expo-router";

const Order = () => {
  const router = useRouter();
  const [quantities, setQuantities] = useState([5, 1]);

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
    <SafeAreaView className="flex-1 bg-primary-lighter p-2">
      <ScrollView className="w-full">
        <View className="flex flex-wrap justify-center flex-row">
          {[
            { type: "Beverage", color: "bg-[#1370CC]" },
            { type: "Starter", color: "bg-[#BC50BE]" },
            { type: "Main", color: "bg-[#D3B61B]" },
            { type: "Dessert", color: "bg-[#5075BE]" },
            { type: "Side", color: "bg-[#81BE50]" },
            { type: "Alcoholic", color: "bg-[#50B8BE]" },
          ].map((category, index) => (
            <TouchableOpacity
              key={index}
              className={`${category.color} m-2 p-4 rounded-lg w-24 h-24 flex justify-center`}
            >
              <Text className="text-white text-center">{category.type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="mt-8 px-4">
          <Text className="text-xl font-bold mb-4">Order Overview</Text>
          {[
            { name: "Bruschetta", price: "15€", extra: "Extra cheese", extraPrice: "0,50€" },
            { name: "Bruschetta", price: "15€", extra: "", extraPrice: "" },
          ].map((item, index) => (
            <View key={index} className="flex flex-col mb-2 border-b border-gray-300 pb-2">
              <View className="flex flex-row justify-between items-center">
                <Text className="flex-1 font-bold text-md">{item.name}</Text>
                <Text className="flex-1 pl-20">{item.price}</Text>
                <View className="flex-none flex-row items-center">
                  <TouchableOpacity
                    className="bg-[#0C3C2E] w-6 h-6 flex justify-center items-center rounded-full"
                    onPress={() => decrementQuantity(index)}
                  >
                    <Text className="text-white">-</Text>
                  </TouchableOpacity>
                  <Text className="mx-2">{quantities[index]}</Text>
                  <TouchableOpacity
                    className="bg-[#0C3C2E] w-6 h-6 flex justify-center items-center rounded-full"
                    onPress={() => incrementQuantity(index)}
                  >
                    <Text className="text-white">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {item.extra ? (
                <View className="flex flex-row justify-between items-center mt-2">
                  <Text className="flex-1 text-gray-600 pl-2">{item.extra}</Text>
                  <Text className="flex-1 text-gray-600">{item.extraPrice}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
        <View className="flex-row justify-between px-4 mt-[35%]">
          <CustomButton
            text="Checkout"
            containerStyles="flex-1 mr-2"
            handlePress={() => {}}
          />
          <CustomButton
            text="Order"
            containerStyles="flex-1 ml-2"
            handlePress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Order;

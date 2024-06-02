import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton";
import { useRouter } from "expo-router";
import AddRemove from "../../../components/AddRemove";
import { useOrder } from "../../../contexts/orderContext";

const Order = () => {
  const router = useRouter();
  const { orderItems, setOrderItems } = useOrder();

  const incrementQuantity = (index) => {
    const newOrderItems = [...orderItems];
    newOrderItems[index].quantity += 1;
    setOrderItems(newOrderItems);
  };

  const decrementQuantity = (index) => {
    const newOrderItems = [...orderItems];
    if (newOrderItems[index].quantity > 0) {
      newOrderItems[index].quantity -= 1;
    }
    if (newOrderItems[index].quantity === 0) {
      newOrderItems.splice(index, 1);
    }
    setOrderItems(newOrderItems);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter">
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
            onPress={() =>
              router.push({
                pathname: "menuItemSelector",
                params: { category: category.type.toLowerCase() },
              })
            }
          >
            <Text className="text-white text-center">{category.type}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView className="w-full">
        <View className="mt-8 px-4">
          {orderItems.length === 0 ? (
            <Text className="text-center font-bold text-xl text-gray-600">
              Order is currently empty
            </Text>
          ) : (
            orderItems.map((item, index) => (
              <View
                key={index}
                className="flex flex-col mb-2 border-b border-gray-300 pb-2"
              >
                <View className="flex flex-row justify-between items-center">
                  <Text className="flex-1 font-bold text-md">{item.name}</Text>
                  <Text className="flex-1 pl-20">{item.price}€</Text>
                  <AddRemove
                    quantity={item.quantity}
                    handleDecrement={() => decrementQuantity(index)}
                    handleIncrement={() => incrementQuantity(index)}
                  />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <View className="flex-row justify-between px-4">
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
    </SafeAreaView>
  );
};

export default Order;

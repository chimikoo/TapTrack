import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import AddRemove from "../../../components/AddRemove";
import { useOrder } from "../../../contexts/orderContext";
import { TAP_TRACK_URL } from "@env";
import axios from "axios";
import { UserContext } from "../../../contexts/userContext.jsx";

const Order = () => {
  const { tableNumber } = useLocalSearchParams();
  const { user } = useContext(UserContext);
  const router = useRouter();
  const { orderItems, setOrderItems } = useOrder();
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getExtras = async () => {
      try {
        setLoading(true);
        const url = `${TAP_TRACK_URL}/users/menu-items/extras/${tableNumber}`;
        const { data } = await axios.get(url);
        setExtras(data.data);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
      }
    };
    getExtras();
  }, []);

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

  const handleOrder = async () => {
    console.log("UserId", user.id);
    const drinks = orderItems
      .filter((item) => item.category === "beverage")
      .map((item) => ({
        drinkItem: item._id,
        quantity: item.quantity,
        size: item.size,
      }));
    const starter = orderItems
      .filter((item) => item.category === "starter")
      .map((item) => ({ dishItem: item._id, quantity: item.quantity }));

    const main = orderItems
      .filter((item) => item.category === "main")
      .map((item) => ({ dishItem: item._id, quantity: item.quantity }));
    console.log("main", main);
    const dessert = orderItems
      .filter((item) => item.category === "dessert")
      .map((item) => ({ dishItem: item._id, quantity: item.quantity }));
    console.log("dessert", dessert);
    const side = orderItems
      .filter((item) => item.category === "side")
      .map((item) => ({ dishItem: item._id, quantity: item.quantity }));
    console.log("side", side);
    const extrasArray = extras.map((extra) => extra._id);
    console.log("extrasArray", extrasArray);

    const order = {
      userId: user.id,
      tableNumber,
      drinks,
      starter,
      main,
      dessert,
      side,
      extras: extrasArray,
    };
    try {
      const { data } = await axios.post(
        `${TAP_TRACK_URL}/users/menu-orders`,
        order
      );
      console.log("data", data);
      Alert.alert(data.message);
      // Clear order items
      setOrderItems([]);
    } catch (error) {
      console.log("error", error);
    }
  };

  // console.log("orderItems", orderItems);
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
                params: { category: category.type.toLowerCase(), tableNumber },
              })
            }
          >
            <Text className="text-white text-center">{category.type}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView className="w-full">
        {loading ? (
          <ActivityIndicator size="large" color="#7CA982" />
        ) : (
          <View className="mt-8 px-4">
            {orderItems.length === 0 ? (
              <Text className="text-center font-bold text-xl text-gray-600">
                Order is currently empty
              </Text>
            ) : (
              orderItems.map((item, index) => {
                return (
                  <View
                    key={index}
                    className="flex flex-col mb-2 border-b border-gray-300 pb-2"
                  >
                    <View className="flex flex-row justify-between items-center">
                      <Text className="w-[40%] font-bold text-md">
                        {item.name}
                        {item.size ? ` (${item.size})` : ""}
                      </Text>
                      <Text className="w-[20%]">{item.price}€</Text>
                      <AddRemove
                        quantity={item.quantity}
                        handleDecrement={() => decrementQuantity(index)}
                        handleIncrement={() => incrementQuantity(index)}
                      />
                    </View>
                    <View className="pl-6">
                      {extras &&
                        extras.length > 0 &&
                        extras.map((extra, index) => {
                          if (extra.itemId === item._id) {
                            return (
                              <View
                                key={index}
                                className="flex flex-row justify-between items-center"
                              >
                                <Text className="flex-1">{extra.extra}</Text>
                                <Text className="flex-1">{extra.price}€</Text>
                              </View>
                            );
                          }
                        })}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
      <View className="flex-row justify-between px-4">
        <CustomButton
          text="Checkout"
          containerStyles="flex-1 mr-2 mb-4"
          handlePress={() => {}}
        />
        <CustomButton
          text="Order"
          containerStyles="flex-1 ml-2 mb-4"
          handlePress={handleOrder} // Order backend logic
        />
      </View>
    </SafeAreaView>
  );
};

export default Order;

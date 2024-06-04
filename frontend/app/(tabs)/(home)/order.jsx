// app/(tabs)/(home)/order.jsx
import React, { useEffect, useState, useContext } from "react";
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
import { useMenu } from "../../../contexts/menuContext"; // Import the custom hook

const Order = () => {
  const { tableNumber } = useLocalSearchParams();
  const { user } = useContext(UserContext);
  const router = useRouter();
  const { orderItems, setOrderItems } = useOrder();
  const { menuItems, loading: menuLoading } = useMenu(); // Use the custom hook to access menu items
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true); // Define the loading state

  useEffect(() => {
    const getExtras = async () => {
      try {
        const url = `${TAP_TRACK_URL}/users/menu-items/extras/${tableNumber}`;
        const { data } = await axios.get(url);
        setExtras(data.data);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false); // Ensure loading is set to false in case of error
      }
    };
    getExtras();
  }, [tableNumber]);

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

    const dessert = orderItems
      .filter((item) => item.category === "dessert")
      .map((item) => ({ dishItem: item._id, quantity: item.quantity }));

    const side = orderItems
      .filter((item) => item.category === "side")
      .map((item) => ({ dishItem: item._id, quantity: item.quantity }));

    const extrasArray = extras.map((extra) => extra._id);

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
      const { data } = await axios.get(
        `${TAP_TRACK_URL}/users/tables/${tableNumber}`
      );
      console.log("data", data);
      if (data.table.orderId !== null) {
        await axios.put(
          `${TAP_TRACK_URL}/users/menu-orders/${data.table.orderId}`,
          { drinks, starter, main, dessert, side, extras: extrasArray }
        );
        Alert.alert("Order updated successfully");
      } else {
        await axios.post(`${TAP_TRACK_URL}/users/menu-orders`, order);
        Alert.alert("Order created successfully");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCheckout = async () => {
    console.log("checkout");
    try {
      const { data } = await axios.get(
        `${TAP_TRACK_URL}/users/tables/${tableNumber}`
      );
      console.log("data", data);
      if (data.table.orderId) {
        await axios.post(`${TAP_TRACK_URL}/users/checkout`, {
          orderId: data.table.orderId,
          paymentMethod: "Cash",
        });
        Alert.alert("Checkout successful");
      } else {
        Alert.alert("No order to checkout");
      }
    } catch (error) {
      console.log("error", error);
    }
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
                params: { category: category.type.toLowerCase(), tableNumber },
              })
            }
          >
            <Text className="text-white text-center">{category.type}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView className="w-full">
        {loading || menuLoading ? (
          <ActivityIndicator size="large" color="#7CA982" />
        ) : (
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
                      extras.map((extra, extraIndex) => {
                        if (extra.itemId === item._id) {
                          return (
                            <View
                              key={extraIndex}
                              className="flex flex-row justify-between items-center"
                            >
                              <Text className="flex-1">{extra.extra}</Text>
                              <Text className="flex-1">{extra.price}€</Text>
                            </View>
                          );
                        }
                        return null;
                      })}
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
      <View className="flex-row justify-between px-4">
        <CustomButton
          text="Checkout"
          containerStyles="flex-1 mr-2 mb-4"
          handlePress={handleCheckout}
        />
        <CustomButton
          text="Order"
          containerStyles="flex-1 ml-2 mb-4"
          handlePress={handleOrder}
        />
      </View>
    </SafeAreaView>
  );
};

export default Order;

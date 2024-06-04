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
import Receipt from "./receipt.jsx";
import { useMenu } from "../../../contexts/menuContext"; // Import the custom hook


const Order = () => {
  const { tableNumber } = useLocalSearchParams();
  const { user } = useContext(UserContext);
  const router = useRouter();
  const { orderItems, setOrderItems } = useOrder();
  const { menuItems, loading: menuLoading } = useMenu(); // Use the custom hook to access menu items
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true); // Define the loading state

  // Get order items for the specific table number
  const currentOrder = orderItems.find(
    (order) => order.tableNumber === tableNumber
  );
  const items = currentOrder ? currentOrder.items : [];

  useEffect(() => {
    const getExtras = async () => {
      try {
        const url = `${TAP_TRACK_URL}/users/menu-items/extras/table/${tableNumber}`;
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

  const incrementQuantity = (tableNumber, itemId, size) => {
    setOrderItems((prevOrderItems) => {
      return prevOrderItems.map((order) => {
        if (order.tableNumber !== tableNumber) return order;
        return {
          ...order,
          items: order.items.map((item) => {
            if (item._id !== itemId) return item;
            if (item.category === "beverage" && item.size === size) {
              return { ...item, quantity: item.quantity + 1 };
            }
            if (item.category !== "beverage") {
              return { ...item, quantity: item.quantity + 1 };
            }
            return item;
          }),
        };
      });
    });
  };

  const decrementQuantity = (tableNumber, itemId, size) => {
    setOrderItems((prevOrderItems) => {
      return prevOrderItems.map((order) => {
        if (order.tableNumber !== tableNumber) return order;
        return {
          ...order,
          items: order.items.reduce((acc, item) => {
            if (item._id !== itemId) {
              acc.push(item);
            } else {
              if (item.category === "beverage" && item.size === size) {
                if (item.quantity > 1) {
                  acc.push({ ...item, quantity: item.quantity - 1 });
                }
              } else if (item.category !== "beverage") {
                if (item.quantity > 1) {
                  acc.push({ ...item, quantity: item.quantity - 1 });
                }
              }
            }
            return acc;
          }, []),
        };
      });
    });
  };

  const handleOrder = async () => {
    const drinks = items
      .filter((item) => item.category === "beverage")
      .map((item) => ({
        drinkItem: item._id,
        quantity: item.quantity,
        size: item.size,
      }));
    const starter = items
      .filter((item) => item.category === "starter")
      .map((item) => ({ dishItem: item._id, quantity: item.quantity }));

    const main = items
      .filter((item) => item.category === "main")
      .map((item) => ({ dishItem: item._id, quantity: item.quantity }));

    const dessert = items
      .filter((item) => item.category === "dessert")
      .map((item) => ({ dishItem: item._id, quantity: item.quantity }));

    const side = items
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
      if (data.table.orderId) {
        console.log("helloooo inside checkout");
        const response = await axios.post(`${TAP_TRACK_URL}/users/checkout`, {
          orderId: data.table.orderId,
          paymentMethod: "Cash",
        });

        Alert.alert("Checkout successful");
        // clear order items and extras from the current table
        setOrderItems((prevOrderItems) =>
          prevOrderItems.filter((order) => order.tableNumber !== tableNumber)
        );
        setExtras((prevExtras) =>
          prevExtras.filter((extra) => extra.tableNumber !== tableNumber)
        );
        router.push({
          pathname: "receipt",
          params: { receiptId: response.data.receipt._id },
        });
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
            {items.length === 0 ? (
              <Text className="text-center font-bold text-xl text-gray-600">
                Order is currently empty
              </Text>
            ) : (
              items.map((item, index) => {
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
                        handleDecrement={() =>
                          decrementQuantity(tableNumber, item._id, item.size)
                        }
                        handleIncrement={() =>
                          incrementQuantity(tableNumber, item._id, item.size)
                        }
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
                          return null; // Ensure a return here to avoid any undefined return issues
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

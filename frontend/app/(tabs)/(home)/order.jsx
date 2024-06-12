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
import { useMenu } from "../../../contexts/menuContext";
import {
  decrementQuantity,
  incrementQuantity,
} from "../../../utils/handleQuantity.js";
import { SvgXml } from "react-native-svg";
import menuSvgs from "../../../utils/menuSvgs.js";
import { useTheme } from "../../../contexts/themeContext.jsx";

const Order = () => {
  const { tableNumber } = useLocalSearchParams();
  const { user } = useContext(UserContext);
  const router = useRouter();
  const { orderItems, setOrderItems } = useOrder();
  const { menuItems, loading: menuLoading } = useMenu(); // Use the custom hook to access menu items
  const [loading, setLoading] = useState(true); // Define the loading state
  const { theme } = useTheme();

  const bgColor = theme === "light" ? "bg-primary-lighter" : "bg-primary-dark";
  const textColor =
    theme === "light" ? "text-primary-dark" : "text-primary-lighter";

  // Get order items for the specific table number
  const currentOrder = orderItems.find(
    (order) => order.tableNumber === tableNumber
  );
  const items = currentOrder ? currentOrder.items : [];

  useEffect(() => {
    // Assume loading is done after the first render
    setLoading(false);
  }, []);

  const handleOrder = async () => {
    const drinks = items
      .filter((item) => item.category === "beverage")
      .map((item) => ({
        drinkItem: item._id,
        quantity: item.quantity,
        size: item.size,
        extras: item.extras,
      }));
    const starter = items
      .filter((item) => item.category === "starter")
      .map((item) => ({
        dishItem: item._id,
        quantity: item.quantity,
        extras: item.extras,
      }));

    const main = items
      .filter((item) => item.category === "main")
      .map((item) => ({
        dishItem: item._id,
        quantity: item.quantity,
        extras: item.extras,
      }));

    const dessert = items
      .filter((item) => item.category === "dessert")
      .map((item) => ({
        dishItem: item._id,
        quantity: item.quantity,
        extras: item.extras,
      }));

    const side = items
      .filter((item) => item.category === "side")
      .map((item) => ({
        dishItem: item._id,
        quantity: item.quantity,
        extras: item.extras,
      }));

    const order = {
      userId: user.id,
      tableNumber,
      drinks,
      starter,
      main,
      dessert,
      side,
    };

    try {
      const { data } = await axios.get(
        `${TAP_TRACK_URL}/users/tables/${tableNumber}`
      );
      if (data.table.orderId !== null) {
        await axios.put(
          `${TAP_TRACK_URL}/users/menu-orders/${data.table.orderId}`,
          order
        );
        Alert.alert("Order updated successfully");
      } else {
        await axios.post(`${TAP_TRACK_URL}/users/menu-orders`, order);
        Alert.alert("Order created successfully");
      }
    } catch (error) {
      Alert.alert("Error creating order", error.message);
    }
  };

  const handleCheckout = async () => {
    console.log("checkout");
    try {
      const { data } = await axios.get(
        `${TAP_TRACK_URL}/users/tables/${tableNumber}`
      );
      if (data.table.orderId) {
        const response = await axios.post(`${TAP_TRACK_URL}/users/checkout`, {
          orderId: data.table.orderId,
          paymentMethod: "Cash",
        });
        Alert.alert("Checkout successful");
        // clear order items from the current table
        setOrderItems((prevOrderItems) =>
          prevOrderItems.filter((order) => order.tableNumber !== tableNumber)
        );
        // navigate to receipt page
        router.push({
          pathname: "receipt",
          params: { receiptId: response.data.receipt._id },
        });
      } else {
        Alert.alert("No order to checkout");
      }
    } catch (error) {
      Alert.alert("Error checking out", error.message);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <View className="flex flex-wrap justify-center flex-row">
        {menuSvgs.map((category, index) => {
          const svgXml = category.xml.replace(/currentColor/g, "#f00");
          return (
            <TouchableOpacity
              key={index}
              className={`m-2 w-24 h-24 flex justify-center items-center`}
              onPress={() =>
                router.push({
                  pathname: "menuItemSelector",
                  params: {
                    category: category.type.toLowerCase(),
                    tableNumber,
                  },
                })
              }
            >
              <SvgXml xml={svgXml} width="100%" height="100" />
            </TouchableOpacity>
          );
        })}
      </View>
      <ScrollView className="w-full">
        {loading || menuLoading ? (
          <ActivityIndicator size="large" color="#7CA982" />
        ) : (
          <View className="mt-8 px-4">
            {items.length === 0 ? (
              <Text className="text-center font-bold text-xl text-primary">
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
                      <Text
                        className={`w-[40%] font-bold text-md ${textColor}`}
                      >
                        {item.name}
                        {item.size ? ` (${item.size})` : ""}
                      </Text>
                      <Text className={`w-[20%] ${textColor}`}>
                        {item.price}€
                      </Text>
                      <AddRemove
                        quantity={item.quantity}
                        handleDecrement={() =>
                          decrementQuantity(
                            tableNumber,
                            item._id,
                            item.size,
                            item.extras,
                            setOrderItems
                          )
                        }
                        handleIncrement={() =>
                          incrementQuantity(
                            tableNumber,
                            item._id,
                            item.size,
                            item.extras,
                            setOrderItems
                          )
                        }
                      />
                    </View>
                    <View className="pl-6 w-[55%]">
                      {item.extras &&
                        item.extras.map((extra, index) => (
                          <View
                            key={index}
                            className="flex-row justify-between"
                          >
                            <Text className={`text-sm ${textColor}`}>
                              +{extra.extra}
                            </Text>
                            <Text className={textColor}>{extra.price}€</Text>
                          </View>
                        ))}
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

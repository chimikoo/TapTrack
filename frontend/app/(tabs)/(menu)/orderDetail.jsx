import { useLocalSearchParams, router } from "expo-router";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderItemsMap from "../../../components/OrderItemsMap.jsx";
import CustomButton from "../../../components/CustomButton.jsx";
import { useEffect, useState } from "react";
import { TAP_TRACK_URL } from "@env";
import axios from "axios";

const OrderDetail = () => {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState({});

  useEffect(() => {
    const getOrder = async () => {
      try {
        const url = `${TAP_TRACK_URL}/users/menu-orders/${orderId}`;
        const { data } = await axios.get(url);
        setOrder(data.data);
      } catch (error) {
        console.log("Error fetching order", error);
      }
    };
    getOrder();
  }, []);

  const handleCheckout = async () => {
    console.log("checkout");
    try {
      await axios.post(`${TAP_TRACK_URL}/users/checkout`, {
        orderId: orderId,
        paymentMethod: "Cash",
      });
      Alert.alert("Checkout successful");
      router.push("/orders");
    } catch (error) {
      Alert.alert("Error checking out", error.message);
    }
  };

  return (
    <SafeAreaView>
      <>
        {order && (
          <ScrollView
            className={`w-[90%] m-auto rounded-lg p-6 mb-4 ${
              order.isCheckout ? "bg-primary" : "bg-secondary"
            }`}
          >
            <View className="flex-row justify-between items-center border-b border-myWhite py-2">
              <Text className="text-myWhite text-xl">Order ID</Text>
              <Text className="text-myWhite text-xs">{orderId}</Text>
            </View>
            <View className="flex-row justify-between border-b border-myWhite py-4">
              <Text className="text-myWhite">Host</Text>
              <Text className="text-myWhite">{order.userId?.firstName}</Text>
            </View>
            <View className="flex-row justify-between border-b border-myWhite py-4">
              <Text className="text-myWhite">Table N°</Text>
              <Text className="text-myWhite">{order.tableNumber}</Text>
            </View>
            {order.drinks && (
              <OrderItemsMap title="Drinks" items={order.drinks} />
            )}
            {order.starter && (
              <OrderItemsMap title="Starters" items={order.starter} />
            )}
            {order.main && <OrderItemsMap title="Mains" items={order.main} />}
            {order.side && <OrderItemsMap title="Sides" items={order.side} />}
            {order.dessert && (
              <OrderItemsMap title="Desserts" items={order.dessert} />
            )}
            <View className="flex-row justify-between py-4 mb-10">
              <Text className="text-myWhite">Date</Text>
              <Text className="text-myWhite">
                {order.timestamp?.slice(0, 10)}
              </Text>
            </View>
          </ScrollView>
        )}
        {!order.isCheckout && (
          <CustomButton
            text="Checkout"
            containerStyles="w-[50%] m-auto mb-4"
            handlePress={handleCheckout}
          />
        )}
      </>
    </SafeAreaView>
  );
};

export default OrderDetail;

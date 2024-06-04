import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton.jsx";
import { useEffect, useState } from "react";
import { TAP_TRACK_URL } from "@env";
import axios from "axios";

const Receipt = () => {
  const { receiptId } = useLocalSearchParams();
  const [receipt, setReceipt] = useState({});
  const [loading, setLoading] = useState(false);
  console.log("receiptId", receiptId);

  useEffect(() => {
    const getReceipt = async () => {
      try {
        setLoading(true);
        const url = `${TAP_TRACK_URL}/users/checkout/${receiptId}`;
        const { data } = await axios.get(url);
        console.log("data", data);
        setReceipt(data.data);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
      }
    };
    getReceipt();
  }, []);

  console.log("items", receipt);

  const items = receipt.items || [];
  const order = receipt.orderId || {};
  const transactionDate = receipt.transactionDate || "";

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter items-center px-4 pb-4">
      <ScrollView className="w-full flex-1 bg-gray-200 rounded-lg p-8">
        {loading ? (
          <ActivityIndicator size="large" color="#7CA982" />
        ) : (
          <>
            <Text className="text-2xl font-bold text-center">Lagoon Plaza</Text>
            <Text className="text-center mt-6">--------------------------</Text>
            <View className="flex-row justify-between items-center pt-4">
              <Text>Order: </Text>
              <Text>{order?._id ?? ""}</Text>
            </View>
            <View className="flex-row justify-between items-center pt-4">
              <Text>Date:</Text>
              <Text>{transactionDate.slice(0, 10)}</Text>
              <Text>{transactionDate.slice(11, 16)}</Text>
            </View>
            <Text className="text-center mt-4">--------------------------</Text>
            <View className="flex-row justify-between items-center pt-4">
              <Text>Host: {order?.userId?.firstName ?? "Default Name"}</Text>
              <Text>Table No: {receipt.tableNumber}</Text>
            </View>
            <Text className="text-center mt-4">--------------------------</Text>
            <View>
              {items &&
                items.map((item, index) => {
                  return (
                    <View
                      key={index}
                      className="flex flex-row justify-between pt-4"
                    >
                      <Text className="w-[10%]">{item.quantity}</Text>
                      <Text className="w-[40%]">{item.itemName}</Text>
                      <Text className="text-right">{item.price}</Text>
                      <Text className="text-right">
                        {item.price * item.quantity}
                      </Text>
                    </View>
                  );
                })}
            </View>
            <Text className="text-center mt-4">--------------------------</Text>
            <View className="flex-row justify-between items-center pt-4 mb-10">
              <Text className="text-lg font-bold">Total</Text>
              <Text className="text-lg font-bold">
                {receipt ? receipt.totalAmount : "0.00"}€
              </Text>
            </View>
          </>
        )}
      </ScrollView>
      <View className="w-full flex items-end mt-4">
        <CustomButton
          text="Print"
          containerStyles="w-[40%]"
          handlePress={() => console.log("Print button pressed")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Receipt;

import axios from "axios";
import { TAP_TRACK_URL } from "@env";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

const ReceiptComponent = ({ receipt, loading, tipAmount }) => {
  const [oldExtras, setOldExtras] = useState([]);
  const items = receipt.items || [];
  const order = receipt.orderId || {};
  const extras = order.extras || [];
  const transactionDate = receipt.transactionDate || "";

  console.log("order", order);

  useEffect(() => {
    const getExtras = async () => {
      const extrasArray = extras.map(async (ext) => {
        const extra = await getExtraById(ext);
        return extra;
      });
      const extrasList = await Promise.all(extrasArray);
      setOldExtras(extrasList);
    };
    getExtras();
  }, []);

  console.log("oldExtras", oldExtras);

  const getExtraById = async (id) => {
    try {
      const url = `${TAP_TRACK_URL}/users/menu-items/extras/${id}`;
      const { data } = await axios.get(url);
      const oldExtra = data.extra[0] && data.extra[0].oldExtra;
      return oldExtra;
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log("items", items);

  return (
    <ScrollView className="w-full flex-1 bg-gray-200 rounded-lg p-8">
      {loading ? (
        <ActivityIndicator size="large" color="#7CA982" />
      ) : (
        <>
          <View className="border-b-2 border-dashed pb-10">
            <Text className="text-2xl font-bold text-center">Lagoon Plaza</Text>
          </View>
          <View className="flex-row justify-between items-center pt-4">
            <Text>Order: </Text>
            <Text>{order?._id ?? ""}</Text>
          </View>
          <View className="flex-row justify-between items-center pt-4 border-b-2 border-dashed pb-5">
            <Text>Date:</Text>
            <Text>{transactionDate.slice(0, 10)}</Text>
            <Text>{transactionDate.slice(11, 16)}</Text>
          </View>
          <View className="flex-row justify-between items-center pt-4 border-b-2 border-dashed pb-5">
            <Text>Host: {order?.userId?.firstName ?? "Default Name"}</Text>
            <Text>Table No: {receipt.tableNumber}</Text>
          </View>
          <View className="border-b-2 border-dashed ">
            {items &&
              items.length > 0 &&
              oldExtras &&
              oldExtras.length > 0 &&
              items.map((item, index) => {
                const connectedExtra = oldExtras?.find(
                  (ext) => ext.itemName === item.itemName
                );
                console.log("connectedExtra", connectedExtra);
                return (
                  <View key={index} className="border-b border-gray-300 pb-2">
                    <View className="flex flex-row justify-between pt-4">
                      <Text className="w-[10%]">{item.quantity}</Text>
                      <Text className="w-[40%]">{item.itemName}</Text>
                      <Text className="text-right">{item.price}</Text>
                      <Text className="text-right">
                        {item.price * item.quantity}
                      </Text>
                    </View>
                    {connectedExtra && (
                      <View className="flex flex-row justify-between pt-4">
                        <Text className=""></Text>
                        <Text className="w-[50%]">
                          +{connectedExtra?.extra}
                        </Text>
                        <Text className="text-right">
                          {connectedExtra?.price}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
          <View className="mb-10">
            <View className="flex-row justify-between items-center pt-4">
              <Text className="text-lg font-bold">Total</Text>
              <Text className="text-lg font-bold">
                {receipt?.totalAmount?.toFixed(2)}€
              </Text>
            </View>
            {tipAmount > 0 && (
              <View className="flex-row justify-between items-center pt-4">
                <Text className="text-base font-bold">Tip</Text>
                <Text className="text-base font-bold">
                  {tipAmount.toFixed(2)}€
                </Text>
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default ReceiptComponent;

import axios from "axios";
import { TAP_TRACK_URL } from "@env";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";

const ReceiptComponent = ({ receipt, loading, tipAmount }) => {
  const items = receipt.items || [];
  const order = receipt.orderId || {};
  const extras = order.extras || [];
  const transactionDate = receipt.transactionDate || "";

  const getExtraById = async (id) => {
    try {
      const url = `${TAP_TRACK_URL}/users/menu-items/extras/${id}`;
      const { data } = await axios.get(url);
      const oldExtra = data.extra[0] && data.extra[0].oldExtra;
      console.log("oldExtra", oldExtra);
      return data.extra;
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
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
          {extras && extras.length > 0 && (
            <View>
              <Text className="text-center mt-4">
                --------------------------
              </Text>
              <Text>Extras:</Text>
              {extras &&
                extras.map(async (ext, index) => {
                  const extra = await getExtraById(ext);
                  console.log("extra", extra);
                  return (
                    <View
                      key={index}
                      className="flex flex-row justify-between pt-4"
                    >
                      <Text className="w-[40%]">{extra?.oldExtra?.extra}</Text>
                      <Text className="text-right">
                        {extra?.oldExtra?.price}
                      </Text>
                    </View>
                  );
                })}
            </View>
          )}
          <Text className="text-center mt-4">--------------------------</Text>
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

import { View, Text, ScrollView, ActivityIndicator } from "react-native";

const ReceiptComponent = ({ receipt, loading, tipAmount }) => {
  const items = receipt.items || [];
  const order = receipt.orderId || {};
  const transactionDate = receipt.transactionDate || "";

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
          <View className="border-b-2 border-dashed">
            {items &&
              items.map((item, index) => {
                console.log("extras", item.extras);

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
                    {item.extras &&
                      item.extras.map((extra, index) => (
                        <View
                          className="flex flex-row justify-between pt-4"
                          key={index}
                        >
                          <Text className=""></Text>
                          <Text className="w-[50%]">+{extra?.extraName}</Text>
                          <Text className="text-right">
                            {extra?.extraPrice}
                          </Text>
                        </View>
                      ))}
                  </View>
                );
              })}
          </View>
          <View className="mb-10">
            <View className="flex-row justify-between items-center pt-4">
              <Text className="text-lg font-bold">Total</Text>
              <Text className="text-lg font-bold">{receipt?.totalAmount}€</Text>
            </View>
            {tipAmount > 0 && (
              <View className="flex-row justify-between items-center pt-4">
                <Text className="text-base font-bold">Tip</Text>
                <Text className="text-base font-bold">{tipAmount}€</Text>
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default ReceiptComponent;

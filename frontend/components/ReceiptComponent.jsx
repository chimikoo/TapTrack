import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useTheme } from "../contexts/themeContext.jsx";

const ReceiptComponent = ({ receipt, loading, tipAmount }) => {
  const items = receipt.items || [];
  const order = receipt.orderId || {};
  const transactionDate = receipt.transactionDate || "";

  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-gray-200" : "bg-opacGray";
  const textColor =
    theme === "light" ? "text-primary-dark" : "text-primary-lighter";
  const borderColor =
    theme === "light" ? "border-primary-dark" : "border-primary-lighter";
  return (
    <ScrollView className={`w-full flex-1 rounded-lg p-8 ${bgColor}`}>
      {loading ? (
        <ActivityIndicator size="large" color="#7CA982" />
      ) : (
        <>
          <View className={`border-b-2 border-dashed pb-10 ${borderColor}`}>
            <Text className={`text-2xl font-bold text-center ${textColor}`}>
              Lagoon Plaza
            </Text>
          </View>
          <View className="flex-row justify-between items-center pt-4">
            <Text className={`${textColor}`}>Order: </Text>
            <Text className={`${textColor}`}>{order?._id ?? "1234567890"}</Text>
          </View>
          <View
            className={`flex-row justify-between items-center pt-4 border-b-2 border-dashed pb-5 ${borderColor}`}
          >
            <Text className={`${textColor}`}>Date:</Text>
            <Text className={`${textColor}`}>
              {transactionDate.slice(0, 10)}
            </Text>
            <Text className={`${textColor}`}>
              {transactionDate.slice(11, 16)}
            </Text>
          </View>
          <View
            className={`flex-row justify-between items-center pt-4 border-b-2 border-dashed pb-5 ${borderColor}`}
          >
            <Text className={`${textColor}`}>
              Host: {receipt.host ?? "Bruce Wayne"}
            </Text>
            <Text className={`${textColor}`}>
              Table No: {receipt.tableNumber}
            </Text>
          </View>
          <View className={`border-b-2 border-dashed ${borderColor}`}>
            {items &&
              items.map((item, index) => {
                return (
                  <View key={index} className="border-b border-gray-300 pb-2">
                    <View className="flex flex-row justify-between pt-4">
                      <Text className={`w-[10%] ${textColor}`}>
                        {item.quantity}
                      </Text>
                      <Text className={`w-[40%] ${textColor}`}>
                        {item.itemName}
                      </Text>
                      <Text className={`text-right ${textColor}`}>
                        {item.price}
                      </Text>
                      <Text className={`text-right ${textColor}`}>
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
                          <Text className={`w-[50%] ${textColor}`}>
                            +{extra?.extraName}
                          </Text>
                          <Text className={`text-right ${textColor}`}>
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
              <Text className={`text-lg font-bold ${textColor}`}>Total</Text>
              <Text className={`text-lg font-bold ${textColor}`}>
                {receipt?.totalAmount}€
              </Text>
            </View>
            {tipAmount > 0 && (
              <View className="flex-row justify-between items-center pt-4">
                <Text className={`text-lg font-bold ${textColor}`}>Tip</Text>
                <Text className={`text-lg font-bold ${textColor}`}>
                  {tipAmount}€
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

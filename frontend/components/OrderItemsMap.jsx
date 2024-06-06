import { View, Text } from "react-native";

const OrderItemsMap = ({ title, items }) => {
  return (
    <>
      <View className="flex-row justify-between border-b border-myWhite py-4">
        <Text className="text-myWhite text-lg">{title}</Text>
      </View>
      <View className="border-b border-myWhite py-4">
        {items.map((item, index) => (
          <View key={index} className="flex-row justify-between w-full pl-8">
            <Text className="text-myWhite">{item.quantity}</Text>
            <Text className="text-myWhite w-[50%]">{item.name}</Text>
            <Text className="text-myWhite">{item.price}€</Text>
          </View>
        ))}
      </View>
    </>
  );
};

export default OrderItemsMap;

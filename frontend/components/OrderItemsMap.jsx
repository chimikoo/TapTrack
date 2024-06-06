import { View, Text } from "react-native";

const OrderItemsMap = ({ title, items }) => {
  if (!items.length) return null;

  return (
    <>
      <View className="flex-row justify-between border-b border-myWhite py-4">
        <Text className="text-myWhite text-lg">{title}</Text>
      </View>
      <View className="border-b border-myWhite py-4">
        {items.map((item, index) => {
          const itemName = item.dishItem?.name || item.drinkItem?.name;
          const itemSize = item.size || "";
          const itemPrice =
            item.dishItem?.price ||
            item.drinkItem?.sizesPrices.find((price) => price.size === itemSize)
              .price;
          return (
            <View key={index} className="flex-row justify-between w-full pl-8">
              <Text className="text-myWhite">{item.quantity}</Text>
              <Text className="text-myWhite w-[50%]">
                {itemName}
                {itemSize && ` (${itemSize})`}
              </Text>
              <Text className="text-myWhite">{itemPrice}€</Text>
            </View>
          );
        })}
      </View>
    </>
  );
};

export default OrderItemsMap;

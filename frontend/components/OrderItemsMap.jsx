import { View, Text } from "react-native";

const OrderItemsMap = ({ title, items }) => {
  if (!items.length) return null;

  console.log("items", items);

  return (
    <>
      <View className="flex-row justify-between border-b border-myWhite py-4">
        <Text className="text-myWhite text-lg">{title}</Text>
      </View>
      {items.map((item, index) => {
        const itemName = item.dishItem
          ? item.dishItem.name
          : item.drinkItem.name;
        const itemSize = item.size || "";
        const itemPrice = item.dishItem
          ? item.dishItem.price
          : item.drinkItem.sizesPrices.find((sp) => sp.size === itemSize).price;
        return (
          <View key={index} className="pl-6 border-b border-myWhite py-4">
            <View className="flex-row justify-between">
              <Text className="text-myWhite w-[50%]">
                {itemName} {itemSize}
              </Text>
              <Text className="text-myWhite">{item.quantity}</Text>
              <Text className="text-myWhite">{itemPrice}€</Text>
            </View>
            {item.extras.map((extra, index) => {
              return (
                <View key={index} className="flex-row justify-between">
                  <Text className="text-myWhite pl-6">+{extra.extra}</Text>
                  <Text className="text-myWhite">{extra.price}€</Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </>
  );
};

export default OrderItemsMap;

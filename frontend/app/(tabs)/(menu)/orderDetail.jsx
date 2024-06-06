import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderItemsMap from "../../../components/OrderItemsMap.jsx";
import CustomButton from "../../../components/CustomButton.jsx";

const OrderDetail = () => {
  const { orderId } = useLocalSearchParams();

  const order = {
    id: 1,
    Host: "Luke",
    tableNumber: 101,
    transactionDate: "2022-01-01",
    drinks: [
      { name: "Coke", price: 3.0, quantity: 2 },
      { name: "Sprite", price: 3.0, quantity: 1 },
      { name: "Fanta", price: 3.0, quantity: 1 },
    ],
    starter: [
      { name: "Spring Roll", price: 5.0, quantity: 2 },
      { name: "Prawn Toast", price: 5.0, quantity: 1 },
      { name: "Prawn Crackers", price: 2.0, quantity: 1 },
    ],
    main: [
      { name: "Kung Po Chicken", price: 12.0, quantity: 2 },
      { name: "Sweet and Sour Pork", price: 12.0, quantity: 1 },
    ],
    side: [{ name: "Egg Fried Rice", price: 6.0, quantity: 2 }],
    dessert: [
      { name: "Ice Cream", price: 5.0, quantity: 2 },
      { name: "Chocolate Cake", price: 5.0, quantity: 1 },
    ],
  };

  return (
    <SafeAreaView>
      <ScrollView className="w-[90%] m-auto bg-primary rounded-lg p-6 mb-4">
        <View className="flex-row justify-between border-b border-myWhite py-2">
          <Text className="text-myWhite text-xl">Order ID</Text>
          <Text className="text-myWhite text-xl">{orderId}</Text>
        </View>
        <View className="flex-row justify-between border-b border-myWhite py-4">
          <Text className="text-myWhite">Host</Text>
          <Text className="text-myWhite">{order.Host}</Text>
        </View>
        <View className="flex-row justify-between border-b border-myWhite py-4">
          <Text className="text-myWhite">Table N°</Text>
          <Text className="text-myWhite">{order.tableNumber}</Text>
        </View>
        <OrderItemsMap title="Drinks" items={order.drinks} />
        <OrderItemsMap title="Starters" items={order.starter} />
        <OrderItemsMap title="Mains" items={order.main} />
        <OrderItemsMap title="Sides" items={order.side} />
        <OrderItemsMap title="Desserts" items={order.dessert} />
        <View className="flex-row justify-between py-4 mb-10">
          <Text className="text-myWhite">Date</Text>
          <Text className="text-myWhite">{order.transactionDate}</Text>
        </View>
      </ScrollView>
      <CustomButton 
        text="Checkout" 
        containerStyles="w-[50%] m-auto mb-4"
        handlePress={() => {
          console.log("Pay button pressed");
        }}
      />
    </SafeAreaView>
  );
};

export default OrderDetail;

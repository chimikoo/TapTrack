import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";

const users = [
  { id: 1, name: "User 1" },
  { id: 2, name: "User 2" },
  { id: 3, name: "User 3" },
];

const orders = [
  { id: 1, userId: 1, tableNumber: 1, transactionDate: "2022-01-01" },
  { id: 2, userId: 1, tableNumber: 2, transactionDate: "2022-01-02" },
  { id: 3, userId: 2, tableNumber: 3, transactionDate: "2022-01-03" },
  { id: 4, userId: 2, tableNumber: 4, transactionDate: "2022-01-04" },
  { id: 5, userId: 3, tableNumber: 5, transactionDate: "2022-01-05" },
  { id: 6, userId: 1, tableNumber: 1, transactionDate: "2022-01-01" },
  { id: 7, userId: 1, tableNumber: 2, transactionDate: "2022-01-02" },
  { id: 8, userId: 2, tableNumber: 3, transactionDate: "2022-01-03" },
  { id: 9, userId: 2, tableNumber: 4, transactionDate: "2022-01-04" },
  { id: 10, userId: 3, tableNumber: 5, transactionDate: "2022-01-05" },
  { id: 11, userId: 1, tableNumber: 1, transactionDate: "2022-01-01" },
  { id: 12, userId: 1, tableNumber: 2, transactionDate: "2022-01-02" },
  { id: 13, userId: 2, tableNumber: 3, transactionDate: "2022-01-03" },
  { id: 14, userId: 2, tableNumber: 4, transactionDate: "2022-01-04" },
  { id: 15, userId: 3, tableNumber: 5, transactionDate: "2022-01-05" },
  { id: 16, userId: 1, tableNumber: 1, transactionDate: "2022-01-01" },
  { id: 17, userId: 1, tableNumber: 2, transactionDate: "2022-01-02" },
  { id: 18, userId: 2, tableNumber: 3, transactionDate: "2022-01-03" },
  { id: 19, userId: 2, tableNumber: 4, transactionDate: "2022-01-04" },
  { id: 20, userId: 3, tableNumber: 5, transactionDate: "2022-01-05" },
];

const Orders = () => {
  const [selectedUserId, setSelectedUserId] = useState(users[0].id);

  const filteredOrders = orders.filter(
    (order) => order.userId === selectedUserId
  );

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-primary-dark mb-4">Orders</Text>
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity className="flex-row justify-between items-center p-4 bg-primary mb-4 rounded-lg w-full" onPress={() => {
            router.push({
                pathname: "/orderDetail",
                params: { orderId: item.id },
            });
          }}>
            <Text className="text-white">Table: {item.tableNumber}</Text>
            <Text className="text-white">{item.transactionDate}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, width: "100%" }}
      />
      <View className="mt-4 mb-4 w-full px-4 flex items-center">
        <View className="w-[60%] border rounded-lg pb-2 bg-primary-dark">
          <Picker
            selectedValue={selectedUserId}
            onValueChange={(itemValue) => setSelectedUserId(itemValue)}
            style={{ height: 50, width: "100%", color: "white" }}
            dropdownIconColor={"white"}
          >
            {users.map((user) => (
              <Picker.Item key={user.id} label={user.name} value={user.id} />
            ))}
          </Picker>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Orders;

import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { TAP_TRACK_URL } from "@env";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllOrders = async () => {
      try {
        const url = `${TAP_TRACK_URL}/users/menu-orders`;
        const { data } = await axios.get(url);
        setOrders(data.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    const getAllUsers = async () => {
      try {
        const url = `${TAP_TRACK_URL}/users`;
        const { data } = await axios.get(url);
        setUsers(data.employees);
        setSelectedUserId(data.employees[0]._id);
        setLoading(false);
      } catch (error) {
        console.error("error", error);
      }
    };
    getAllOrders();
    getAllUsers();
  }, []);

  const filteredOrders = orders.filter(
    (order) => order.userId._id === selectedUserId
  );

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-primary-lighter">
      <Text className="text-2xl font-bold text-primary-dark mb-4">Orders</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#7CA982" />
      ) : (
        <>
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row justify-between items-center p-4 bg-primary mb-4 rounded-lg w-full"
                onPress={() => {
                  router.push({
                    pathname: "/orderDetail",
                    params: { orderId: item._id },
                  });
                }}
              >
                <Text className="text-white">Table: {item.tableNumber}</Text>
                <Text className="text-white">
                  {item.timestamp.slice(0, 10)}
                </Text>
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
                  <Picker.Item
                    key={user._id}
                    label={user.firstName}
                    value={user._id}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Orders;

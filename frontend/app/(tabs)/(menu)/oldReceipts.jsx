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
import NotFound from "../../../components/NotFound.jsx";

const OldReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedHost, setSelectedHost] = useState("all");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const getOldReceipts = async () => {
      try {
        const url = `${TAP_TRACK_URL}/users/checkout/receipts/oldreceipts`;
        const { data } = await axios.get(url);
        setReceipts(data.data);
        setLoading(false);
      } catch (error) {
        console.error("error", error);
        if (error.response.status === 404) {
          setNotFound(true);
        }
      }
    };

    const getAllUsers = async () => {
      try {
        const url = `${TAP_TRACK_URL}/users`;
        const { data } = await axios.get(url);
        setUsers(data.employees);
      } catch (error) {
        console.error("error", error);
      }
    };

    getOldReceipts();
    getAllUsers();
  }, []);

  if (notFound) {
    return <NotFound text="No old receipts found" />;
  }

  const filteredReceipts = receipts.filter((receipt) => {
    if (selectedHost === "all") {
      return true; // Show all receipts when "All" is selected
    } else {
      return receipt.host === selectedHost;
    }
  });

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-primary-lighter">
      <Text className="text-2xl font-bold text-primary-dark mb-4">
        Old Receipts
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#7CA982" />
      ) : (
        <>
          {filteredReceipts.length ? (
            <FlatList
              data={filteredReceipts}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`flex-row justify-between items-center p-4 mb-4 rounded-lg w-full ${
                    item.isPaid ? "bg-primary" : "bg-secondary"
                  }`}
                  onPress={() => {
                    router.push({
                      pathname: "/oldReceiptDetail",
                      params: { receiptId: item._id },
                    });
                  }}
                >
                  <Text className="text-white">Table: {item.tableNumber}</Text>
                  <Text className="text-white">
                    {item.transactionDate.slice(0, 10)}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingHorizontal: 16, width: "100%" }}
            />
          ) : (
            <View className="h-[77%]">
              <Text className="text-xl text-primary-dark">
                No receipts found for {selectedHost}
              </Text>
            </View>
          )}
          <View className="mt-4 mb-4 w-full px-4 flex items-center">
            <View className="w-[60%] border rounded-lg pb-2 bg-primary-dark">
              <Picker
                selectedValue={selectedHost}
                onValueChange={(itemValue) => setSelectedHost(itemValue)}
                style={{ height: 50, width: "100%", color: "white" }}
                dropdownIconColor={"white"}
              >
                <Picker.Item label="All" value="all" />
                {users.map((user) => (
                  <Picker.Item
                    key={user._id}
                    label={user.firstName}
                    value={user.firstName}
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

export default OldReceipts;

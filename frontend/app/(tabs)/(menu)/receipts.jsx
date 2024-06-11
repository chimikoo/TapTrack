import { useContext, useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../../../contexts/userContext.jsx";
import { TAP_TRACK_URL } from "@env";
import axios from "axios";
import { router } from "expo-router";
import NotFound from "../../../components/NotFound.jsx";

const Receipts = () => {
  const { user } = useContext(UserContext);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const getReceipts = async () => {
      try {
        const url = `${TAP_TRACK_URL}/users/checkout/user/${user.id}`;
        const { data } = await axios.get(url);
        setReceipts(data.data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching receipts. Status: ", error.response.status);
        if (error.response.status === 404) {
          setNotFound(true);
        }
      }
    };
    getReceipts();
  }, []);

  // If no receipts are found, display a message
  if (notFound) {
    return <NotFound text="No receipts found" />;
  }

  return (
    <SafeAreaView className="flex justify-center items-center">
      <Text className="text-2xl font-bold text-primary-dark">Receipts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#7CA982" />
      ) : (
        <ScrollView className="mt-4 w-[85%] h-[85%]">
          {receipts.map((receipt, index) => {
            const isPaidStyle = receipt.isPaid ? "bg-primary" : "bg-secondary";
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  router.push({
                    pathname: "/receiptDetail",
                    params: { receiptId: receipt._id },
                  });
                }}
                className={`flex-1 flex-row justify-between items-center p-4 ${isPaidStyle} mb-4 rounded-lg`}
              >
                <Text className="text-myWhite">
                  Table: {receipt.tableNumber}
                </Text>
                <Text className="text-myWhite">
                  {receipt.transactionDate.slice(0, 10)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Receipts;

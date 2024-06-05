import axios from "axios";
import { TAP_TRACK_URL } from "@env";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import ReceiptComponent from "../../../components/ReceiptComponent.jsx";

const ReceiptDetail = () => {
  const { receiptId } = useLocalSearchParams();
  const [receipt, setReceipt] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getReceipt = async () => {
      try {
        setLoading(true);
        const url = `${TAP_TRACK_URL}/users/checkout/${receiptId}`;
        const { data } = await axios.get(url);
        setReceipt(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getReceipt();
  }, []);

  return (
    <View className="h-full">
      <View className="h-[83%] m-4">
        <ReceiptComponent
          receipt={receipt}
          loading={loading}
          tipAmount={receipt.notes}
        />
      </View>
    </View>
  );
};

export default ReceiptDetail;

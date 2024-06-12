import axios from "axios";
import { TAP_TRACK_URL } from "@env";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import ReceiptComponent from "../../../components/ReceiptComponent.jsx";
import CustomButton from "../../../components/CustomButton.jsx";
import { useTheme } from "../../../contexts/themeContext.jsx";

const OldReceiptDetail = () => {
  const { receiptId } = useLocalSearchParams();
  const [receipt, setReceipt] = useState({});
  const [loading, setLoading] = useState(false);
  const { theme, bgColor, textColor } = useTheme();

  useEffect(() => {
    const getReceipt = async () => {
      try {
        setLoading(true);
        const url = `${TAP_TRACK_URL}/users/checkout/receipts/oldreceipts/${receiptId}`;
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
    <View className={`h-full ${bgColor}`}>
      <View className="h-[83%] m-4">
        <ReceiptComponent
          receipt={receipt}
          loading={loading}
          tipAmount={receipt.notes}
        />
      </View>
      <View className="flex-row justify-end items-center p-4">
        <CustomButton
          text="Print"
          handlePress={() => console.log("Print receipt")}
          containerStyles="w-[30%]"
        />
      </View>
    </View>
  );
};

export default OldReceiptDetail;
